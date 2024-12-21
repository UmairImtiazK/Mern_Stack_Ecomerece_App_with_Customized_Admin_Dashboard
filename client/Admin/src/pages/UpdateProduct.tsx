import { useEffect, useState } from "react";
import axios from "axios";
import { ImageUpload, InputWithLabel, Sidebar } from "../components";
import { HiOutlineSave } from "react-icons/hi";
import SimpleInput from "../components/SimpleInput";
import TextAreaInput from "../components/TextAreaInput";
import { useParams, useNavigate } from "react-router-dom";

const UpdateProduct = () => {
  const { id } = useParams<{ id: string }>(); // Get the product ID from URL
  const navigate = useNavigate(); // For redirecting after update

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    imageUrl: ""
  });
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const categories = [
    { value: "", label: "Select a category" },
    { value: "Men", label: "men" },
    { value: "Popular", label: "popular" },
    { value: "Women", label: "women" },
    { value: "Child", label: "child" },
    { value: "New", label: "new" },
  ];

  // Fetch product data only once
  useEffect(() => {
    if (id) {
      fetchProductData(id);
    }
  }, [id]);

  const fetchProductData = async (productId: string) => {
    try {
      console.log("Fetching data for product ID:", productId);
      const response = await axios.get(`http://localhost:8000/product/get/${productId}`);
      console.log("Response data:", response.data);

      if (response.data && response.data.data) {
        // Assuming response.data.data contains the product information
        const product = response.data.data;
        setProductData({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          category: product.category || "",
          stockQuantity: product.stockQuantity || "",
          imageUrl: product.image,
        });
        setIsEditing(true); // Set to true to indicate we are editing an existing product
      } else {
        setError("Invalid data received from the server.");
      }
    } catch (err) {
      console.error("Error fetching product data:", err);
      setError("Failed to fetch product data.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (file: File) => {
    setImage(file);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (!productData.name || !productData.description || !productData.price || !productData.category || !productData.stockQuantity) {
      setError("Please fill out all required fields");
      return;
    }

    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (image) {
      formData.append("image", image);
    }

    try {
      const url = `http://localhost:8000/product/update/${id}`;
      const response = await axios.put(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        alert("Product updated successfully!");
        navigate(`/products/${id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="hover:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary">
              {isEditing ? "Edit product" : "Add new product"}
            </h2>
            <button
              onClick={handleSubmit}
              className="dark:bg-whiteSecondary bg-blackPrimary w-48 py-2 text-lg dark:hover:bg-white hover:bg-black flex items-center justify-center gap-x-2"
            >
              <HiOutlineSave className="dark:text-blackPrimary text-whiteSecondary text-xl" />
              <span className="dark:text-blackPrimary text-whiteSecondary font-semibold">
                {isEditing ? "Update product" : "Publish product"}
              </span>
            </button>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10">
            <div>
              <h3 className="text-2xl font-bold dark:text-whiteSecondary text-blackPrimary">
                Basic information
              </h3>
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
              <h3 className="text-2xl font-bold dark:text-whiteSecondary text-blackPrimary">
                Product images
              </h3>
              <ImageUpload imageUrl={productData.imageUrl} onImageSelect={handleImageChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
