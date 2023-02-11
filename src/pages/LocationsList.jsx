import { useEffect, useReducer, useState } from "react";
import "react-modern-drawer/dist/index.css";
import { useFetch } from "use-http";
import { Input } from "../components/Input.jsx";
import { LocationAdd } from "../components/LocationAdd.jsx";
import { LocationsEdit } from "../components/LocationEdit.jsx";
import cityData from "./../datasets/cityData.json";



const LocationsTableHeaderCell = ({ children }) => (
  <th className={"px-6 py-4"}>{children}</th>);
const LocationsTableCell = ({ children }) => (
  <td className={"px-6 py-4"}>{children}</td>);

function LocationsTableRow ({ item, refresh }) {
  const { id, name, address, phone } = item;
  const { delete: deleteLocation } = useFetch("");

  async function handleDelete() {
    const areYouSure = confirm("Silmek istediğinize emin misiniz?");
    if (areYouSure) {
      await deleteLocation(`location/${id}`);
      refresh();
    }
  }

  const LocationActions = () => (<div className={"flex gap-12"}>
    <LocationsEdit item={item} refresh={refresh}/>
    <button className={"text-red-500"} onClick={handleDelete}>Sil</button>
  </div>);

  return (
    <tr
      className={"bg-white border-b even:bg-gray-100 hover:bg-gray-200 text-left"}>
      <LocationsTableCell>{id}</LocationsTableCell>
      <LocationsTableCell>{name}</LocationsTableCell>
      <LocationsTableCell>{address}</LocationsTableCell>
      <LocationsTableCell>{phone}</LocationsTableCell>
      <LocationsTableCell>
        <LocationActions/>
      </LocationsTableCell>
    </tr>
  );
}

function LocationsTable ({ data, refresh }) {
  return (
    <div className={"relative overflow-x-auto shadow-sm sm:rounded-lg"}>
      <table className="w-full text-sm text-left ">
        <thead className={"text-sm text-gray-700 uppercase bg-gray-50"}>
        <tr>
          <LocationsTableHeaderCell>ID</LocationsTableHeaderCell>
          <LocationsTableHeaderCell>Ad</LocationsTableHeaderCell>
          <LocationsTableHeaderCell>Adres</LocationsTableHeaderCell>
          <LocationsTableHeaderCell>Telefon</LocationsTableHeaderCell>
          <LocationsTableHeaderCell>Aksiyonlar</LocationsTableHeaderCell>
        </tr>
        </thead>
        <tbody>
        {data.map(
          (item) => (<LocationsTableRow item={item} key={item.id} refresh={refresh}/>))}
        </tbody>
      </table>
    </div>
  );
}

export const LocationFilters = ({ dispatchFilters }) => {
  const [city, setCity] = useState(null);
  const [district, setDistrict] = useState(null);

  return (
    <div className={"flex gap-4 basis-1/3"}>
      <div className="flex bg-gray-100 w-full">
        <select className="bg-gray-100 p-4 font-bold w-full" id="city"
                onChange={(e) => {
                  setDistrict(null);
                  setCity(Number(e.target.value));
                  dispatchFilters(
                    { city: Number(e.target.value) || null, district: null });
                }}>
          <option value="" selected={city === null}>Şehir</option>
          {
            cityData.map((item) => (
              <option value={item.id} key={item.id}
                      selected={city === item.id}>{item.key}</option>
            ))
          }
        </select>
      </div>
      <div className="flex bg-gray-100 w-full">
        <select className="bg-gray-100 p-4 font-bold w-full" id={"district"}
                onChange={e => {
                  setDistrict(e.target.value);
                  dispatchFilters({ district: Number(e.target.value) || null });
                }}>
          <option value="" selected={district === null}>İlçe</option>
          {
            city && cityData.find(item => item.id === city)?.districts.map(
              (item) => (
                <option value={item.id} key={item.id}
                        selected={district === item.id}>{item.key}</option>
              ))
          }
        </select>
      </div>
    </div>
  );
};

function Token () {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <div className="gap-x-4">
      <Input placeholder={"ADMIN"} className={"mb-6 w-64"}
      value={token} onChange={(e) => {
        setToken(e.target.value)
      }}/>

      <button className={"bg-blue-500 p-2 ml-4 text-white rounded-lg"}
              onClick={() => {
                localStorage.setItem('token', token)
              }}>
        Kaydet
      </button>
    </div>
  )
}

export const LocationsList = () => {
  const [filters, dispatchFilters] = useReducer(
    (state, newState) => ({ ...state, ...newState }), {});

  const { get, data, loading, error } = useFetch("/", {}, []);

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (data?.data) {
      setFilteredData(data.data);
    }
  }, [data]);

  useEffect(() => {
    let filteredData = data?.data;

    if (filters.city) {
      setFilteredData(
        filteredData = filteredData.filter(
          item => item.cityId === filters.city),
      );
    }

    if (filters.district) {
      setFilteredData(
        filteredData = filteredData.filter(
          item => item.districtId === filters.district),
      );
    }

    setFilteredData(filteredData);
  }, [filters]);

  const refresh = async () => {
    const refreshResult = await get("?" + Date.now());
    console.log({ refreshResult });
  };

  console.log(data)

  return (
    <div className={"container"}>
      <div className={"flex justify-between my-6"}>
        <div className="flex items-center justify-center">
          <h1 className={"text-3xl text-bold"}>
            Lokasyonlar
          </h1>

          <LocationAdd refresh={refresh}/>
        </div>

        <LocationFilters dispatchFilters={dispatchFilters}/>
      </div>

      <Token/>

      {filteredData && <LocationsTable data={filteredData} refresh={refresh}/>}
      {loading && <div>Loading...</div>}

      <div className={"w-full flex justify-center my-8 p-2"}>
        {filteredData && filteredData.length} kayıt bulundu.
      </div>
    </div>
  );
};
