import React, { useState } from "react";
import Button from "@mui/material/Button";

interface ProfileImageProps {
  defaultImage?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ defaultImage }) => {
  const [image, setImage] = useState<string | null>(defaultImage || null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = () => {
    console.log("Saving image:", image);

    setImage(null);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: "200px",
            height: "200px",
            border: "1px solid #ccc",
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          {image ? (
            <img
              src={image}
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                backgroundColor: "#f0f0f0",
              }}
            >
              No Image
            </div>
          )}
        </div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
      >
        {image ? (
          <Button variant="contained" onClick={handleSaveImage}>
            Edit Image
          </Button>
        ) : (
          <>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <Button
              variant="contained"
              onClick={handleSaveImage}
            >
              Save Image
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default ProfileImage;
