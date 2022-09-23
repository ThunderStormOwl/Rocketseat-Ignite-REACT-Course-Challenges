import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      // TODO
      const newCart = [...cart];

      const productStock = (await api.get(`/stock/${productId}`)).data;
      const productInCart = newCart.find((product) => product.id === productId);

      if (productInCart === undefined) {
        const product = (await api.get(`/products/${productId}`)).data;
        const formatedProduct = { ...product, amount: 1 };
        newCart.push(formatedProduct);
      } else if (productInCart.amount + 1 > productStock.amount) {
        throw new Error('Quantidade solicitada fora de estoque');
      } else productInCart.amount++;

      setCart(newCart);

      localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart));
    } catch (e: any) {
      // TODO
      toast.error('Erro na adição do produto');
      toast.error(e.message);
      // localStorage.clear();
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
      const newCart = cart.filter((product) => product.id !== productId);
      if (newCart.length === cart.length) throw new Error('');
      setCart(newCart);
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart));
    } catch (e: any) {
      // TODO
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({ productId, amount }: UpdateProductAmount) => {
    try {
      // TODO
      const newCart = [...cart];
      const updatedProduct = newCart.find((product) => product.id === productId);
      if (amount <= 0) return;
      else {
        const productStock = (await api.get(`/stock/${productId}`)).data;
        if (productStock.amount < amount) throw new Error('Quantidade solicitada fora de estoque');
        else {
          updatedProduct!.amount = amount;
        }
      }
      setCart(newCart);
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart));
    } catch (e: any) {
      // TODO
      toast.error('Erro na alteração de quantidade do produto');
      toast.error(e.message);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addProduct, removeProduct, updateProductAmount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
