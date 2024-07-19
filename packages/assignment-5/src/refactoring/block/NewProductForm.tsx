import { Product } from '../../types';

interface NewProductFormProps {
  newProduct: Omit<Product, 'id'>;
  updateNewProductForm: (property: string, value: string | number) => void;
  addNewProduct: (product: Omit<Product, 'id'>) => void;
}
type InputConstant = {
  id: string;
  label: string;
  type: 'text' | 'number';
  property: keyof Omit<Product, 'id'>;
};

const NewProductForm = ({ newProduct, updateNewProductForm, addNewProduct }: NewProductFormProps) => {
  const INPUT_CONSTANT: InputConstant[] = [
    {
      id: 'productName',
      label: '상품명',
      type: 'text',
      property: 'name',
    },
    {
      id: 'productPrice',
      label: '가격',
      type: 'number',
      property: 'price',
    },
    {
      id: 'productStock',
      label: '재고',
      type: 'number',
      property: 'stock',
    },
  ];

  return (
    <div className='bg-white p-4 rounded shadow mb-4'>
      <h3 className='text-xl font-semibold mb-2'>새 상품 추가</h3>
      {INPUT_CONSTANT.map((input) => (
        <div className='mb-2' key={input.id}>
          <label htmlFor={input.id} className='block text-sm font-medium text-gray-700'>
            {input.label}
          </label>
          <input
            id={input.id}
            type={input.type}
            value={newProduct[input.property] as string | number}
            onChange={(e) => updateNewProductForm(input.property, e.target.value)}
            className='w-full p-2 border rounded'
          />
        </div>
      ))}
      <button
        onClick={() => addNewProduct(newProduct)}
        className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600'>
        추가
      </button>
    </div>
  );
};
export default NewProductForm;
