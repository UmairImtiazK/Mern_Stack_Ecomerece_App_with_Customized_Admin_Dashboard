import { useState, useEffect } from "react";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  imageUrl?: string; // Optional image URL prop
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, imageUrl }) => {
  const [preview, setPreview] = useState<string | null>(null);

  // Update the preview if an imageUrl is passed
  useEffect(() => {
    if (imageUrl) {
      setPreview(imageUrl); // If imageUrl is provided, show that as the preview
    }
  }, [imageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onImageSelect(file);
      setPreview(URL.createObjectURL(file)); // Show file preview
    }
  };

  return (
    <div className="flex items-center justify-center w-full mt-5">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer dark:bg-blackPrimary bg-whiteSecondary dark:hover:border-gray-600 hover:border-gray-500"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-8 h-8 mb-4 text-blackPrimary dark:text-whiteSecondary"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-blackPrimary dark:text-whiteSecondary">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs dark:text-whiteSecondary text-blackPrimary">
            SVG, PNG, JPG, or GIF (MAX. 800x400px)
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;