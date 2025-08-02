import axiosClient from "@/app/Service/ApiClient";

const CreateSeller = async (storeName:string, storeDescription:string, storeLogo:string) => {
  return await axiosClient.post("/seller", {
    storeName,storeDescription,storeLogo
  });
};

const UpdateSeller = async (formData: FormData, id: number) => {
  return await axiosClient.patch(`/seller/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const CreateAddress = async (formData: any) => {
  return await axiosClient.post("/address", formData);
};

const UpdateAddress = async (id: number, formData: any) => {
  return await axiosClient.patch(`/address/${id}`, formData);
};

const Delete = async (id: number) => {
  return await axiosClient.delete(`/address/${id}`);
};

const CreateProduct = async (formData: FormData, id: number) => {
  return await axiosClient.post(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const CreateNameAttributes = async (name: string, id: number) => {
  return await axiosClient.post(`/attributes/${id}`, { name });
};

const CreateAttributesValue = async (formData: FormData, id: number) => {
  return await axiosClient.post(`/attributes/value/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
const DeleteProduct = async (id: number) => {
  return await axiosClient.delete(`/products/${id}`);
};

const GetMyProducts = async (id_Seller: number, id_Category: number) => {
  return await axiosClient.get(`/products/${id_Seller}/${id_Category}`);
};
const PatchProduct = async (id: number, formData: any) => {
  return await axiosClient.patch(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const GetSeller = async (id: number) => {
  return await axiosClient.get(`/seller/${id}`);
};

export {
  GetSeller,
  PatchProduct,
  GetMyProducts,
  DeleteProduct,
  CreateSeller,
  UpdateSeller,
  CreateAddress,
  UpdateAddress,
  Delete,
  CreateProduct,
  CreateNameAttributes,
  CreateAttributesValue,
};
