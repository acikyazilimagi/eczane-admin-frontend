import { useReducer, useState } from "react";
import "react-modern-drawer/dist/index.css";
import { useFetch } from "use-http";
import { Input } from "../components/Input.jsx";
import { LocationAdd } from "../components/LocationAdd.jsx";
import { LocationsEdit } from "../components/LocationEdit.jsx";
import cityData from "./../datasets/cityData.json";
import { getDateQuery } from "../utils.js";

const LocationsTableHeaderCell = ({ children }) => (
  <th className={"px-6 py-4"}>{children}</th>
);
const LocationsTableCell = ({ className, children }) => (
  <td className={"px-6 py-4 " + className}>{children}</td>
);

function LocationsTableRow ({ item }) {
  const {
    id,
    name,
    address,
    phone,
    additionalAddressDetails,
    type,
    source,
    isValidated,
  } = item;
  const { delete: deleteLocation, get } = useFetch("");

  const refresh = () => {
    get(getDateQuery);
  };

  async function handleDelete () {
    const areYouSure = confirm("Silmek istediğinize emin misiniz?");
    if (areYouSure) {
      await deleteLocation(`location/${id}`);
      // TODO: Sayfa yerine sadece data yenilenecek. Ortak bir state'e bağlamak gerekebilir.
      window.location.reload();
      refresh();
    }
  }

  const LocationActions = () => (
    <div className={"flex gap-8"}>
      <LocationsEdit item={item} refresh={refresh}/>
      <button className={"text-red-500"} onClick={handleDelete}>
        Sil
      </button>
    </div>
  );

  return (
    <tr
      className={
        "bg-white border-b even:bg-gray-100 hover:bg-gray-200 text-left"
      }
    >
      <LocationsTableCell>{id}</LocationsTableCell>
      <LocationsTableCell>{type}</LocationsTableCell>
      <LocationsTableCell>{name}</LocationsTableCell>
      <LocationsTableCell>{address}</LocationsTableCell>
      <LocationsTableCell>{additionalAddressDetails}</LocationsTableCell>
      <LocationsTableCell>{phone}</LocationsTableCell>
      <LocationsTableCell className={"w-[10rem] break-all"}
                          alt={source}>{source}</LocationsTableCell>
      <LocationsTableCell>{isValidated ? "EVET" : "HAYIR"}</LocationsTableCell>
      <LocationsTableCell>
        <LocationActions/>
      </LocationsTableCell>
    </tr>
  );
}

function LocationsTable ({ data }) {
  return (
    <div className={"relative overflow-x-auto shadow-sm sm:rounded-lg"}>
      <table className="w-full text-sm text-left ">
        <thead className={"text-sm text-gray-700 uppercase bg-gray-50 sticky"}>
        <tr>
          <LocationsTableHeaderCell>ID</LocationsTableHeaderCell>
          <LocationsTableHeaderCell>Tipi</LocationsTableHeaderCell>
          <LocationsTableHeaderCell>Ad</LocationsTableHeaderCell>
          <LocationsTableHeaderCell>Açık Adres</LocationsTableHeaderCell>
          <LocationsTableHeaderCell>Adres Tarifi</LocationsTableHeaderCell>
          <LocationsTableHeaderCell>Telefon</LocationsTableHeaderCell>
          <LocationsTableHeaderCell>Kaynak</LocationsTableHeaderCell>
          <LocationsTableHeaderCell>Doğrulandı mı</LocationsTableHeaderCell>
          <LocationsTableHeaderCell>Aksiyonlar</LocationsTableHeaderCell>
        </tr>
        </thead>
        <tbody>
        {data.map((item) => (
          <LocationsTableRow item={item} key={item.id}/>
        ))}
        </tbody>
      </table>
    </div>
  );
}

export const LocationFilters = ({ dispatchFilters }) => {
  const [city, setCity] = useState(null);
  const [district, setDistrict] = useState(null);
  const [type, setType] = useState(null);

  const { data, loading } = useFetch("/types", {}, []);

  return (
    <div className={"flex gap-4 basis-1/3 my-4 md:my-0"}>
      <div className="flex bg-gray-100 w-full">
        <select
          className="bg-gray-100 p-4 font-bold w-full"
          id="type"
          onChange={(e) => {
            console.log(e.target.value);
            setType(e.target.value);
            dispatchFilters({
              type: e.target.value || null,
            });
          }}
        >
          <option value="" selected={type === null}>
            Tip
          </option>
          {data &&
            data.data &&
            data.data.map((item) => (
              <option
                value={item.id}
                key={item.id}
                selected={type === item.id}
              >
                {item.name}
              </option>
            ))}
        </select>
      </div>
      <div className="flex bg-gray-100 w-full">
        <select
          className="bg-gray-100 p-4 font-bold w-full"
          id="city"
          onChange={(e) => {
            setDistrict(null);
            setCity(Number(e.target.value));
            dispatchFilters({
              city: Number(e.target.value) || null,
              district: null,
            });
          }}
        >
          <option value="" selected={city === null}>
            Şehir
          </option>
          {cityData.map((item) => (
            <option value={item.id} key={item.id} selected={city === item.id}>
              {item.key}
            </option>
          ))}
        </select>
      </div>
      <div className="flex bg-gray-100 w-full">
        <select
          className="bg-gray-100 p-4 font-bold w-full"
          id={"district"}
          onChange={(e) => {
            setDistrict(e.target.value);
            dispatchFilters({ district: Number(e.target.value) || null });
          }}
        >
          <option value="" selected={district === null}>
            İlçe
          </option>
          {city &&
            cityData.find((item) => item.id === city)?.
              districts.map((item) => (
                <option
                  value={item.id}
                  key={item.id}
                  selected={district === item.id}
                >
                  {item.key}
                </option>
              ))}
        </select>
      </div>
    </div>
  );
};

function Token () {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <div className="gap-x-4">
      <Input
        placeholder={"ADMIN"}
        className={"mb-2 w-64"}
        value={token}
        onChange={(e) => {
          setToken(e.target.value);
        }}
      />

      <button
        className={"bg-blue-500 py-2 px-4 text-white rounded-lg mb-6"}
        onClick={() => {
          localStorage.setItem("token", token);
        }}
      >
        Kaydet
      </button>
    </div>
  );
}

export const LocationsList = () => {
  const [filters, dispatchFilters] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {},
  );

  const { get, data, loading } = useFetch("/locations/admin", {}, []);

  const refresh = () => {
    get(getDateQuery);
  };

  const typeFilteredData = data?.data?.filter(
    (item) => !filters.type || Number(item.typeId) === Number(filters.type),
  );

  const cityFilteredData = typeFilteredData?.filter(
    (item) => !filters.city || item.cityId === filters.city,
  );

  const districtFilteredData = cityFilteredData?.filter(
    (item) => !filters.district || item.districtId === filters.district,
  );

  const sortedData = districtFilteredData?.sort((a, b) => b.id - a.id);

  return (
    <div className={"container"}>
      <div className={"flex justify-between my-6 flex-col md:flex-row"}>
        <div className="flex items-center justify-center">
          <h1 className={"text-3xl text-bold"}>Lokasyonlar</h1>
          <LocationAdd refresh={refresh}/>
        </div>

        <LocationFilters dispatchFilters={dispatchFilters}/>
      </div>

      <Token/>

      {sortedData && <LocationsTable data={sortedData}/>}
      {loading && <div>Loading...</div>}

      <div className={"w-full flex justify-center my-8 p-2"}>
        {sortedData && sortedData.length} kayıt bulundu.
      </div>
    </div>
  );
};
