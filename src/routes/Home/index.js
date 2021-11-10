import axios from 'axios'
import { useEffect, useState } from 'react'

import './index.css'

export default function Home() {

    const [getMembers, setMembers] = useState({data:[]})

    const [getSearch, setSearch] = useState({data:[]})
    useEffect(() => {
        axios.get(`https://www.superheroapi.com/api.php/5327109537305573/1`).then(res => {
            setMembers({data: [res.data]})
        })
    }, [])


    const addMember = () =>{
        const popup = document.getElementById("popup");
        popup.style.display = "flex"
    }

    const closePopup = () => {
        const popup = document.getElementById("popup");
        popup.style.display = "none"
        setSearch({data: []})
    }

    const searchHeroe = () => {
        const name = document.getElementById("shero").value;
        if(name.length >= 1) {
            axios.get(`https://www.superheroapi.com/api.php/5327109537305573/search/${name}`).then(res => {
                if(res.data.response == "success"){
                    setSearch({data: res.data.results})
                }
                else {
                    alert("Ocurrio un error")
                }
            })        
        }
    }

    const addToTeam = (info) => {
        const members = getMembers.data;

        const result = members.filter(m => m.id == info.id)
        if(result.length == 0) {
            members.push(info)
            setMembers({data: members})
        }
        else {
            alert("Ese heroe ya esta en el equipo")
        }
    }

    const removeMember = (id) => {
        const members = getMembers.data;
        const result = members.filter(m => m.id != id)
        setMembers({data: result})
    }


    Array.prototype.promedio = function() {
        var result = [];
        var count = 0;
        this.map((value, index) => {
            Object.keys(value.powerstats).map((key, i)=>{
                if(value.powerstats[key] > 0) {
                    if(!result[key]) {
                        result[key] = 0;
                    }
                    result[key] += parseInt(value.powerstats[key])
                }
            })
            count ++;
        })
        let toarray = []
        Object.keys(result).map((key, i)=>{
            var valor = result[key] / count
            toarray.push({key: key, value: valor})
        })
        console.log(toarray)
        return toarray
    }
    return (
        <div className="container">
            <button onClick={() => { addMember() }}>
                Agregar un miembro
            </button>
            <div id="popup">
                <div id="popupcontent">
                    <div className="popupClose" onClick={() => { closePopup() }}>X</div>
                    <div className="search">
                        <div style={{display:'flex'}}><input type="text" placeholder="Nombre del super heroe" id="shero"/><button onClick={() => {searchHeroe() }}>Buscar</button></div>
                    </div>
                    <div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <td>Nombre</td>
                                    <td>Imagen</td>
                                    <td>Opciones</td>
                                </tr>
                            </thead>
                            <tbody>
                            {getSearch.data.map((value, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{value.name}</td>
                                        <td><img src={value.image.url} alt=""/></td>
                                        <td><button onClick={() => { addToTeam(value) }}>Agregar al equipo</button></td>
                                    </tr>)
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div>
                {
                    getMembers.data.promedio().map((value, i) => {
                        return (<div key={i}>{value.key}:{value.value}</div>)
                    })
                }
            
            </div>
            <table className="table">
                <thead>
                <tr>
                    <td>Nombre</td>
                    <td>Imagen</td>
                    <td>Powerstats</td>
                    <td>Opciones</td>
                </tr>
                </thead>
                <tbody>
                {getMembers.data.map((value, index) => {
                    return (
                        <tr key={index} className="td-se">
                            <td>{value.name}</td>
                            <td><img src={value.image.url} alt=""/></td>
                            <td>
                                {Object.keys(value.powerstats).map((key, i)=>{
                                    return (
                                        <div key={i} className="stats">
                                            <span>{key}</span>
                                            <Barra porcent={value.powerstats[key]} name={key}/>
                                        </div>
                                    )
                                })
                                    }
                            </td>
                            <td className="td-op">
                                <button className="btn cgreen">Detalles</button>
                                <button className="btn cred" onClick={() => { removeMember(value.id) }}>Eliminar</button>
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
}

function Barra(props) {
    const porcent = props.porcent;
    return (
        <div className="barra">
            <div style={{width: porcent+'%'}}>

            </div>
            <span>{porcent}%</span>
        </div>
    )
}