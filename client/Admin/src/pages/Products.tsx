import { useEffect, useState } from "react";
import { Pagination, ProductTable, RowsPerPage, Sidebar, WhiteButton } from "../components";
import { HiOutlinePlus, HiOutlineChevronRight, HiOutlineSearch } from "react-icons/hi";
import { AiOutlineExport } from "react-icons/ai";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState<any[]>([]); // State to hold product data
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status
  const [error, setError] = useState<string | null>(null); // State for error handling
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
  const [sortOrder, setSortOrder] = useState<string>("default"); // State for sorting

  // Fetch products from API on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/product/all");
        console.log(response.data); // Log the data to inspect its structure

        // Check if the response contains the 'data' key and it's an array
        if (response.data && Array.isArray(response.data.data)) {
          const mappedProducts = response.data.data.map((product: any) => {
            return {
              id: product._id || "", // Handle missing _id
              name: product.name || "Unnamed Product", // Default name if missing
              imageUrl: product.imageUrl || "default-image.jpg", // Provide a default image
              sku: product.sku || "N/A", // Ensure SKU is available
              status: product.status || "In stock", // Default to 'In stock' if no status
              price: product.price || 0, // Default price if missing
              createdAt: product.createdAt || new Date().toISOString(), // Default date if missing
            };
          });

          setProducts(mappedProducts); // Set the mapped products
        } else {
          setError("Invalid data format from API.");
        }
        setLoading(false);
      } catch (err) {
        setError("Error fetching products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle sort order change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  // Filter and sort products based on search and sorting order
  const filteredAndSortedProducts = Array.isArray(products)
    ? products
        .filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase())) // Filter by search query
        .sort((a, b) => {
          if (sortOrder === "az") return a.name.localeCompare(b.name); // A-Z
          if (sortOrder === "za") return b.name.localeCompare(a.name); // Z-A
          if (sortOrder === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newest
          if (sortOrder === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); // Oldest
          return 0; // Default (no sorting)
        })
    : []; // Default to empty array if not valid

  return (
    <div className="h-auto border-t dark:border-blackSecondary border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                All products
              </h2>
              <p className="dark:text-whiteSecondary text-blackPrimary text-base font-normal flex items-center">
                <span>Dashboard</span>{" "}
                <HiOutlineChevronRight className="text-lg" />{" "}
                <span>All products</span>
              </p>
            </div>
            <div className="flex gap-x-2 max-[370px]:flex-col max-[370px]:gap-2 max-[370px]:items-center">
              <button className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 w-32 py-2 text-lg hover:border-gray-500 duration-200 flex items-center justify-center gap-x-2">
                <AiOutlineExport className="dark:text-whiteSecondary text-blackPrimary text-base" />
                <span className="dark:text-whiteSecondary text-blackPrimary font-medium">Export</span>
              </button>
              <WhiteButton link="/products/create-product" text="Add a product" textSize="lg" py="2" width="48">
                <HiOutlinePlus className="dark:text-blackPrimary text-whiteSecondary" />
              </WhiteButton>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center mt-5 max-sm:flex-col max-sm:gap-2">
            <div className="relative">
              <HiOutlineSearch className="text-gray-400 text-lg absolute top-3 left-3" />
              <input
                type="text"
                className="w-60 h-10 border dark:bg-blackPrimary bg-white border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 focus:border-gray-500"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div>
              <select
                className="w-60 h-10 dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 pl-3 pr-8 cursor-pointer hover:border-gray-500"
                name="sort"
                id="sort"
                value={sortOrder}
                onChange={handleSortChange}
              >
                <option value="default">Sort by</option>
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>

          {/* Product Table Section */}
          <div className="overflow-hidden border-t dark:border-blackSecondary border-blackSecondary border-1 mt-8">
            {loading ? (
              <div>Loading products...</div>
            ) : error ? (
              <div>{error}</div>
            ) : products.length === 0 ? (
              <div>No products found</div>
            ) : (
              <ProductTable products={filteredAndSortedProducts} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
