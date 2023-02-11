import { useState } from "react";
import Drawer from "react-modern-drawer";
import cityData from "../datasets/cityData.json";

const Input = ({ ...props }) => (
  <input {...props}
         className={"shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}/>
);

const Label = ({ children, className, ...props }) => (
  <label className={"block text-gray-700 text-sm font-bold mt-4 mb-2 " +
    className} {...props}>
    {children}
  </label>
);

export function LocationsEdit ({ item }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const [formData, setFormData] = useState(item);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
  };

  return (
    <>
      <div>
        <button className={"text-blue-500"} onClick={toggleDrawer}>
          Düzenle
        </button>
      </div>

      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction="right"
        size={"50vw"}
        duration={200}
      >
        <div className={"flex justify-between px-8 my-8"}>
          <h2 className={"text-2xl font-bold"}>Lokasyon Düzenle</h2>
        </div>

        <form onSubmit={handleSubmit} className={'px-8'}>
          <div>
            <Label htmlFor="name">Ad: </Label>
            <Input type="text" id="name" name="name" value={formData.name}
                   onChange={handleInputChange}/>
          </div>
          <div>
            <Label htmlFor="phone">Telefon Numarası: </Label>
            <Input type="text" id="phone" name="phone" value={formData.phone}
                   onChange={handleInputChange}/>
          </div>
          <div>
            <Label htmlFor="address">Adres: </Label>
            <Input type="text" id="address" name="address"
                   value={formData.address} onChange={handleInputChange}/>
          </div>
          <div>
            <Label htmlFor="addressDetails">Adres Detayları:</Label>
            <Input type="text" id="addressDetails" name="addressDetails"
                   value={formData.addressDetails}
                   onChange={handleInputChange}/>
          </div>
          <div>
            <Label htmlFor="cityId">Şehir:</Label>

            <div className="inline-block relative w-64">
              <select
                className="block appearance-none w-full bg-white border hover:border-gray-500 px-4 py-2 pr-8 rounded shadow-sm leading-tight focus:outline-none focus:shadow-outline"
                id="city-edit"
                      onChange={(e) => {
                        handleInputChange(e)
                      }}>
                <option value="" selected={formData.cityId === null}>Şehir</option>
                {
                  cityData.map((item, index) => (
                    <option value={item.id} key={index}
                            selected={formData.cityId === item.id}>{item.key}</option>
                  ))
                }
              </select>
              <div
                className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4"
                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path
                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="districtId">İlçe:</Label>
            <Input type="text" id="districtId" name="districtId"
                   value={formData.districtId} onChange={handleInputChange}/>
          </div>
          <div>
            <Label htmlFor="latitude">Latitude:</Label>
            <Input type="text" id="latitude" name="latitude"
                   value={formData.latitude} onChange={handleInputChange}/>
          </div>
          <div>
            <Label htmlFor="longitude">Longitude:</Label>
            <Input type="text" id="longitude" name="longitude"
                   value={formData.longitude} onChange={handleInputChange}/>
          </div>
          <div>
            <Label htmlFor="typeId">Tip:</Label>
            <Input type="text" id="typeId" name="typeId"
                   value={formData.typeId} onChange={handleInputChange}/>
          </div>
          <div>
            <Label htmlFor="subTypeId">Alt tip:</Label>
            <Input type="text" id="subTypeId" name="subTypeId"
                   value={formData.subTypeId} onChange={handleInputChange}/>
          </div>

          <button type="submit" className={'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'}>
            Submit
          </button>
        </form>
      </Drawer>
    </>
  );
}
