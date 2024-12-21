import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import Modal from "./Modal"; // Import the modal component
import axios from 'axios'; // Import axios

const ProductTable = ({ products }: ProductTableProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  // Define the classes for product status
  const inStockClass = "text-green-500";  // Example class for in-stock products
  const outOfStockClass = "text-red-500"; // Example class for out-of-stock products

  const handleEditClick = (product: Product) => {
    navigate(`/update-product/${product.id}`);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
  if (selectedProduct) {
    try {
      const response = await axios.delete(`http://localhost:8000/product/delete/${selectedProduct.id}`);

      if (response.status === 200) {
        alert("Product deleted successfully!");
        
        // Remove the deleted product from the list
        setProducts(prevProducts => prevProducts.filter(product => product.id !== selectedProduct.id));

      }
    } catch (error) {
      alert("Error deleting product");
    }
  }
  setIsDeleteModalOpen(false);
};


  const handleConfirmEdit = () => {
    // Handle saving the edited product here
    setIsModalOpen(false);
  };

  return (
    <>
      <table className="mt-6 w-full whitespace-nowrap text-left max-lg:block max-lg:overflow-x-scroll">
        <colgroup>
          <col className="w-full sm:w-4/12" />
          <col className="lg:w-4/12" />
          <col className="lg:w-2/12" />
          <col className="lg:w-1/12" />
          <col className="lg:w-1/12" />
        </colgroup>
        <thead className="border-b border-white/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
          <tr>
            <th scope="col" className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">
              Product
            </th>
            <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell">
              SKU
            </th>
            <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell">
              Status
            </th>
            <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell lg:pr-20">
              Price
            </th>
            <th scope="col" className="py-2 pl-0 pr-4 text-right font-semibold table-cell sm:pr-6 lg:pr-8">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                <div className="flex items-center gap-x-4">
                  <img
                    src={product.imageUrl || "/path/to/default-image.jpg"}
                    alt={product.name}
                    className="h-8 w-8 rounded-full bg-gray-800"
                  />
                  <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                    {product.name}
                  </div>
                </div>
              </td>
              <td className="py-4 pl-0 pr-4 table-cell pr-8">
                <div className="font-mono text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
                  {product.sku}
                </div>
              </td>
              <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
                <div className="flex items-center gap-x-2 justify-start">
                  <div
                    className={product.status === "In stock" ? inStockClass : outOfStockClass}
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                  </div>
                  <div className="dark:text-whiteSecondary text-blackPrimary block">
                    {product.status}
                  </div>
                </div>
              </td>
              <td className="py-4 pl-0 pr-8 text-sm leading-6 dark:text-rose-200 text-rose-600 font-medium table-cell lg:pr-20">
                {product.price}
              </td>
              <td className="py-4 pr-4 text-right font-medium leading-6 sm:pr-6 lg:pr-8">
                <div className="flex gap-x-1 justify-end">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer hover:border-gray-400"
                  >
                    <HiOutlinePencil className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(product)}
                    className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer hover:border-gray-400"
                  >
                    <HiOutlineTrash className="text-lg" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmEdit}
        title="Edit Product"
      >
        {/* Add the form for editing product details here */}
        <div>
          <label htmlFor="productName">Product Name</label>
          <input
            type="text"
            id="productName"
            defaultValue={selectedProduct?.name}
            className="w-full border p-2"
          />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
      >
        <p>Are you sure you want to delete this product?</p>
      </Modal>
    </>
  );
};

export default ProductTable;
