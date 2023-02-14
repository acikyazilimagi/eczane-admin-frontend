import { useState } from "react";
import { useFetch } from "use-http";

import { LocationSet } from "./LocationSet";

export function LocationsEdit({ item, refresh }) {
  const { response, put } = useFetch("");

  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const getDataAfterInputChange = (formData, name, value) => {
    if (name === "cityId") {
      return { ...formData, cityId: Number(value), districtId: null };
    }

    if (name === "typeId") {
      return { ...formData, typeId: Number(value), subTypeId: null };
    }

    let integerFields = ["districtId", "typeId", "subTypeId"];

    if (integerFields.includes(name)) {
      return { ...formData, [name]: Number(value) };
    }

    return { ...formData, [name]: value };
  };

  async function updateLocation(formData) {
    // Filter form data by fields
    const fields = [
      "name",
      "phone",
      "address",
      "addressDetails",
      "cityId",
      "districtId",
      "typeId",
      "subTypeId",
      "latitude",
      "longitude",
      "source",
      "isValidated",
      "code",
    ];

    if (
      !(
        formData.typeId &&
        formData.subTypeId &&
        formData.cityId &&
        formData.districtId &&
        formData.source?.length > 0
      )
    ) {
      alert("Lütfen tüm alanları doldurunuz");
      return;
    }

    formData.isValidated = Boolean(formData.isValidated);

    let filteredFormData = Object.entries(formData).filter(([key, value]) =>
      fields.includes(key)
    );

    const updateLocationResponse = await put(
      `/location/${item.id}`,
      Object.fromEntries(filteredFormData)
    );
    console.log({ response, updateLocationResponse });

    if (response.ok) {
      if (updateLocationResponse.data) {
        console.log("Updated");

        window.location.reload();

        setTimeout(() => {
          refresh();
          toggleDrawer();
        }, 300);
      }
    }
  }

  return (
    <>
      <div>
        <button className={"text-blue-500"} onClick={toggleDrawer}>
          Düzenle
        </button>
      </div>
      <LocationSet
        header="Konum Düzenle"
        isOpen={isOpen}
        onClose={toggleDrawer}
        item={item}
        onSubmit={updateLocation}
        getDataAfterInputChange={getDataAfterInputChange}
      ></LocationSet>
    </>
  );
}
