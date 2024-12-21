import { ImageUpload, InputWithLabel, Sidebar } from "../components";
import { HiOutlineSave } from "react-icons/hi";
import { useState } from "react";
import axios from "axios";
import SimpleInput from "../components/SimpleInput";
import TextAreaInput from "../components/TextAreaInput";

const CreateProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "", // Default empty category to force selection
    stockQuantity: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Hardcoded category list for simplicity
  const categories = [
    { value: "", label: "Select a category" },
    { value: "men", label: "Men" },
    { value: "popular", label: "Popular" },
    { value: "women", label: "Women" },
    { value: "child", label: "Child" },
    { value: "new", label: "New" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (file: File) => {
    setImage(file);
    setError(null); // Clear error when a valid image is selected
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      setError("Please upload a product image");
      return;
    }

    // Validate required fields
    const { name, description, price, category, stockQuantity } = productData;
    if (!name || !description || !price || !category || !stockQuantity) {
      setError("Please fill out all required fields");
      return;
    }

    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:8000/product/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert("Product created successfully!");
        // Reset form on successful submission
        setProductData({
          name: "",
          description: "",
          price: "",
          category: "", // Reset to empty to force user selection
          stockQuantity: "",
        });
        setImage(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="hover:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary">Add new product</h2>
            <button
              onClick={handleSubmit}
              className="dark:bg-whiteSecondary bg-blackPrimary w-48 py-2 text-lg dark:hover:bg-white hover:bg-black flex items-center justify-center gap-x-2"
            >
              <HiOutlineSave className="dark:text-blackPrimary text-whiteSecondary text-xl" />
              <span className="dark:text-blackPrimary text-whiteSecondary font-semibold">Publish product</span>
            </button>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10">
            <div>
              <h3 className="text-2xl font-bold dark:text-whiteSecondary text-blackPrimary">Basic information</h3>
              <div className="mt-4 flex flex-col gap-5">
                <InputWithLabel label="Title">
                  <SimpleInput
                    name="name"
                    type="text"
                    placeholder="Enter a product title..."
                    value={productData.name}
                    onChange={handleInputChange}
                  />
                </InputWithLabel>
                <InputWithLabel label="Description">
                  <TextAreaInput
                    name="description"
                    placeholder="Enter a product description..."
                    rows={4}
                    value={productData.description}
                    onChange={handleInputChange}
                  />
                </InputWithLabel>
                <InputWithLabel label="Category">
                  <select
                    name="category"
                    value={productData.category}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md p-2"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </InputWithLabel>
                <InputWithLabel label="Price">
                  <SimpleInput
                    name="price"
                    type="number"
                    placeholder="Enter product price..."
                    value={productData.price}
                    onChange={handleInputChange}
                  />
                </InputWithLabel>
                <InputWithLabel label="Stock Quantity">
                  <SimpleInput
                    name="stockQuantity"
                    type="number"
                    placeholder="Enter stock quantity..."
                    value={productData.stockQuantity}
                    onChange={handleInputChange}
                  />
                </InputWithLabel>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold dark:text-whiteSecondary text-blackPrimary">Product images</h3>
              <ImageUpload onImageSelect={handleImageChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
