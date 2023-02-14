import { useState } from "react";
import { useFetch } from "use-http";

import { LocationSet } from "./LocationSet";

export function LocationAdd({ item, refresh }) {
  const { response, post } = useFetch("/location");

  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    if (localStorage.getItem("token") === null) {
      alert("Token gerekli");
      return;
    }
    setIsOpen((prevState) => !prevState);
  };

  const [_, setFormData] = useState(item);

  const getDataAfterInputChange = (formData, name, value) => {
    if (name === "cityId") {
      return { ...formData, cityId: Number(value), districtId: null };
    }

    let integerFields = ["districtId", "typeId", "subTypeId"];

    if (integerFields.includes(name)) {
      return { ...formData, [name]: Number(value) };
    }

    return { ...formData, [name]: value };
  };

  async function addLocation(formData) {
    formData.isValidated = Boolean(formData.isValidated);

    const newLocation = await post({
      ...formData,
    });

    if (response.ok) {
      if (newLocation.data) {
        console.log("New location added");

        setFormData(item);

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
        <button
          type="button"
          className={
            "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-12"
          }
          onClick={toggleDrawer}
        >
          Yeni Konum Ekle
        </button>
      </div>
      <LocationSet
        header="Yeni Konum"
        isOpen={isOpen}
        onClose={toggleDrawer}
        item={item}
        onSubmit={addLocation}
        getDataAfterInputChange={getDataAfterInputChange}
      ></LocationSet>
    </>
  );
}
