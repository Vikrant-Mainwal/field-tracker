export const uploadToCloudinary = async (imageUri) => {
  const data = new FormData();

  data.append("file", {
    uri: imageUri,
    type: "image/jpeg",
    name: "bill.jpg",
  });

  data.append("upload_preset", "field-tracker");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dswamscch/image/upload",
    {
      method: "POST",
      body: data,
    }
  );

  const json = await res.json();
  return json.secure_url;
};
