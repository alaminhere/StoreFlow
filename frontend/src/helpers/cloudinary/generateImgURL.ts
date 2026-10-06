const generateImgURL = async (file: File) => {
  const formData = new FormData();

  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_PRESET_NAME!);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    },
  );

  const data = await res.json();
  if (!res.ok) {
    return {
      success: false,
      message: 'Failed to upload image',
    };
  }
  return {
    success: true,
    message: '',
    url: data.secure_url,
    public_id: data.public_id,
  };
};

export default generateImgURL;
