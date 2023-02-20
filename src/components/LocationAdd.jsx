import { useState } from 'react';
import Drawer from 'react-modern-drawer';
import { useFetch } from 'use-http';
import cityData from '../datasets/cityData.json';
import { Input } from './Input.jsx';
import { Label } from './Label.jsx';
import { Select } from './Select.jsx';
import { subTypeOptions, typeOptions } from './TypeOptions.jsx';

export function LocationAdd({ refresh }) {
  const { data, post, response, loading, get } = useFetch('/location');

  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    if (localStorage.getItem('token') === null) {
      alert('Token gerekli');
      return;
    }
    setIsOpen((prevState) => !prevState);
  };

  const initialFormData = {
    name: '',
    phone: '',
    address: '',
    addressDetails: '',
    code: '',
    latitude: '',
    longitude: '',
    cityId: null,
    districtId: null,
    typeId: null,
    subTypeId: null,
    source: null,
    isValidated: null,
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log({ [name]: value });

    if (name === 'cityId') {
      setFormData({ ...formData, cityId: Number(value), districtId: null });
      return;
    }

    let integerFields = ['districtId', 'typeId', 'subTypeId'];

    if (integerFields.includes(name)) {
      setFormData({ ...formData, [name]: Number(value) });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  async function addLocation() {
    formData.isValidated = formData?.isValidated === 'true' ? true : false;

    const newLocation = await post({
      ...formData,
    });

    if (response.ok) {
      if (newLocation.data) {
        console.log('New location added');

        setFormData(initialFormData);

        setTimeout(() => {
          refresh();
          toggleDrawer();
        }, 300);
      }
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    addLocation();
  };

  return (
    <>
      <div>
        <button
          type="button"
          className={'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-12'}
          onClick={toggleDrawer}
        >
          Yeni Lokasyon Ekle
        </button>
      </div>

      <Drawer open={isOpen} onClose={toggleDrawer} direction="right" className="!w-[80vw] md:!w-[50vw]" duration={200}>
        <div className={'flex justify-between px-8 my-8'}>
          <h2 className={'text-2xl font-bold'}>Yeni Lokasyon</h2>
        </div>

        <form onSubmit={handleSubmit} className={'px-8'}>
          <div>
            <Label htmlFor="name">Ad: </Label>
            <Input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="phone">Telefon Numarası: </Label>
            <Input type="text" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="address">Açık Adres: </Label>
            <Input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="addressDetails">Adres Tarifi:</Label>
            <Input
              type="text"
              id="addressDetails"
              name="addressDetails"
              value={formData.addressDetails}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="code">Kurum kodu:</Label>
            <Input type="text" id="code" name="code" value={formData.code} onChange={handleInputChange} />
          </div>

          <div>
            <Label htmlFor="cityId">Şehir:</Label>

            <Select
              id="cityId"
              name={'cityId'}
              onChange={(e) => {
                handleInputChange(e);
              }}
            >
              <option value="" selected={formData.cityId === null}>
                Şehir
              </option>
              {cityData.map((item) => (
                <option value={item.id} key={item.id} selected={formData.cityId === item.id}>
                  {item.key}
                </option>
              ))}
            </Select>
          </div>

          <Label htmlFor="districtId">İlçe:</Label>

          <Select
            id="districtId"
            name={'districtId'}
            onChange={(e) => {
              handleInputChange(e);
            }}
          >
            <option value="" selected={formData.districtId === null}>
              İlçe
            </option>
            {formData.cityId &&
              cityData
                .find((item) => item.id === Number(formData.cityId))
                ?.districts.map((item) => (
                  <option value={item.id} key={item.id} selected={formData.districtId === item.id}>
                    {item.key}
                  </option>
                ))}
          </Select>

          <div>
            <Label htmlFor="latitude">Latitude:</Label>
            <Input type="text" id="latitude" name="latitude" value={formData.latitude} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude:</Label>
            <Input
              type="text"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="typeId">Tip:</Label>
            <Select name={'typeId'} onChange={handleInputChange}>
              <option value="" selected={formData.type === null}>
                Lütfen seçiniz
              </option>
              {typeOptions.map((item) => (
                <option value={item.id} key={item.id} selected={formData.typeId === item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="subTypeId">Alt tip:</Label>
            <Select name={'subTypeId'} onChange={handleInputChange}>
              <option value="" selected={formData.type === null}>
                Lütfen seçiniz
              </option>
              {formData.typeId &&
                subTypeOptions
                  .filter((item) => item.typeId === Number(formData.typeId))
                  .map((item) => (
                    <option value={item.id} key={item.id} selected={formData.subTypeId === item.id}>
                      {item.name}
                    </option>
                  ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="source">Kaynak:</Label>
            <Input type="text" id="source" name="source" value={formData.source} onChange={handleInputChange} />
          </div>

          <div>
            <Label htmlFor="isValidated">Doğrulandı mı?</Label>
            <Select name={'isValidated'} onChange={handleInputChange}>
              <option value="" selected={formData.isValidated === null}>
                Lütfen seçiniz
              </option>
              {[
                { id: 'true', name: 'Evet' },
                { id: 'false', name: 'Hayır' },
              ].map((item) => (
                <option value={item.id} key={item.id} selected={formData.isValidated === item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </div>

          <button type="submit" className={'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'}>
            Gönder
          </button>

          {loading && <div className={'mt-4'}>Kaydediliyor...</div>}

          {response?.ok && data?.ok && <div className={'mt-4 text-lg'}>Kayıt başarılı</div>}
        </form>
      </Drawer>
    </>
  );
}
