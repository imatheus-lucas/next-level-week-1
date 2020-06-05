import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';


import './styles.css'
import logo from '../../assets/logo.svg'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

import api from '../../services/api'
import { Map, TileLayer, Marker } from 'react-leaflet'
import axios from 'axios'
import DropZone from '../../components/DropZone'

import { LeafletMouseEvent } from 'leaflet'
interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string
}
interface IBGECITYResponse {
  nome: string
}
const CreatePoint: React.FC = () => {

  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([])


  const [seletedUf, setSelectedUf] = useState('0');

  const [citys, setCitys] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('0');

  const [seletedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);

  const [initialPosition, setIninitialPosition] = useState<[number, number]>([0, 0]);

  const [selectedFile, setSelectedFile] = useState<File>();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  })
  const [selectedItem, setSelectedItem] = useState<number[]>([]);

  const history = useHistory();
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setIninitialPosition([latitude, longitude])
      setSelectedPosition([latitude, longitude])
    })

  }, []);

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data)
    })
  }, []);

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const ufInitials = response.data.map(uf => uf.sigla);
        setUfs(ufInitials)
      })
  }, []);

  useEffect(() => {
    if (seletedUf === '0') {
      return;
    }
    axios.get<IBGECITYResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${seletedUf}/municipios`)
      .then(response => {
        const cityNames = response.data.map(uf => uf.nome);
        setCitys(cityNames)
      })

  }, [seletedUf]);

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng
    ])

  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {

    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value })
  }

  function handleSelectedUF(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;

    setSelectedUf(uf);
  }
  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;

    setSelectedCity(city);
  }

  function handleSelectedItem(id: number) {
    const alreadySelected = selectedItem.findIndex(item => item === id)
    if (alreadySelected >= 0) {
      const filteredItems = selectedItem.filter(item => item !== id);
      setSelectedItem(filteredItems)
    } else {
      setSelectedItem([...selectedItem, id])
    }

  }


  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const { name, email, whatsapp } = formData;
    const uf = seletedUf;
    const city = selectedCity;
    const [latitude, longitude] = seletedPosition;
    const items = selectedItem;
    const data = new FormData();

    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('uf', uf);
    data.append('city', city);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('items', items.join(','));
    if (selectedFile) {
      data.append('image', selectedFile)
    }


    await api.post('points', data)
    alert('ponto de coleta criado');
    history.push('/')
  }


  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
         Volta para home
       </Link>
      </header>
      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br /> ponto de coleta</h1>
        <DropZone onFileUpLoade={setSelectedFile} />
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>


        <fieldset>
          <legend>
            <h2>Endereços</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>


          <Map center={initialPosition} zoom={16} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={seletedPosition} />
          </Map>



          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select onChange={handleSelectedUF} value={seletedUf} name="uf" id="uf">
                <option value="0">Selecione uma UF</option>
                {
                  ufs.map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))
                }
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade (UF)</label>
              <select onChange={handleSelectedCity} value={selectedCity} name="city" id="city" >
                <option value="0">Selecione uma cidade</option>
                {
                  citys.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))
                }
              </select>
            </div>
          </div>

        </fieldset>


        <fieldset>
          <legend>
            <h2>Ítens</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>
          <ul className="items-grid">
            {
              items.map(item => (
                <li
                  className={
                    selectedItem.includes(item.id) ? 'selected' : ''
                  } key={item.id} onClick={() => handleSelectedItem(item.id)}>
                  <img src={item.image_url} alt={item.title} />
                  <span>{item.title}</span>
                </li>
              )
              )
            }

          </ul>
        </fieldset>
        <button type="submit">
          cadastrar ponto de coleta
        </button>
      </form>
    </div>
  );
}

export default CreatePoint;