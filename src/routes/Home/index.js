import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import './index.css'

export default function Home() {

    const [getMembers, setMembers] = useState({data:[]})

    const [getSearch, setSearch] = useState({data:[]})

    const [getMemberSelect, setMemberSelect] = useState({id:null})
    useEffect(() => {
        if(localStorage.getItem("token") == null) {
            window.location.href = "/login"
            return 1;
        }
    }, [])


    const addMember = () =>{
        const popup = document.getElementById("popup1");
        popup.style.display = "flex"
    }

    const closePopup = (id) => {
        const popup = document.getElementById("popup"+id);
        popup.style.display = "none"
        if(parseInt(id) == 1){
            setSearch({data: []})
        }
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
        if(members.length >= 6) {
            alert("Ya hay 6 miembros en el equipo")
            return 1;
        }
        var alig_good = 0;
        var alig_bad = 0;

        members.map((value, index) => {
            if(value.id == info.id) {
                alert("Ese superheroe ya esta en el equipo")
                return 1;
            }
            if(value.alignment == "good") {
                alig_good += 1
            }
            else {
                alig_bad += 1
            }
        })
        if(alig_bad >= 3) {
            alert("Ya hay 3 miembros con orientacion mala")
            return 1;
        }
        if(alig_good >= 3) {
            alert("Ya hay 3 miembros con orientacion buena")
            return 1;            
        }
        members.push(info)
        setMembers({data: members})
    }

    const removeMember = (id) => {
        const members = getMembers.data;
        const result = members.filter(m => m.id != id)

        if(getMemberSelect.id != null) {
            if(members[getMemberSelect.id].id == id) {
                setMemberSelect({id:null})
            }
        }
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

    const showDetails = (e, id) => {
        if(e != null) {
            e.preventDefault();
            var el = e.srcElement || e.target;
            if(el) {
                if(el.nodeName != "TD") return 1;
            }
        }
        const members = getMembers.data;

        setMemberSelect({id:id})


        const popup = document.getElementById("popup2");
        popup.style.display = "flex"
    }
    return (
        <div className="container">
            <button className="btn" style={{background:'#30b353', width:'100%', fontSize:'20px',margin:'20px 0'}} onClick={() => { addMember() }}>
                Agregar un miembro
            </button>
            <div id="popup1" className="popup">
                <div className="popupcontent">
                    <div className="popuptit">
                        <span>Buscar SuperHeroe</span>
                        <div className="popupClose" onClick={() => { closePopup(1) }}>X</div>
                    </div>
                    <div>
                        <div className="search">
                            <div style={{display:'flex',width:'100%'}}><input type="text" placeholder="Nombre del super heroe" id="shero"/><button onClick={() => {searchHeroe() }}>Buscar</button></div>
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
                                {
                                    getSearch.data.length == 0 && 
                                    <tr>
                                        <td colSpan="3">Sin resultado</td>
                                    </tr>
                                }
                                {getSearch.data.map((value, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{value.name}</td>
                                            <td><img src={value.image.url} alt=""/></td>
                                            <td><button className="btn" style={{background:'#30b353'}} onClick={() => { addToTeam(value) }}>Agregar al equipo</button></td>
                                        </tr>)
                                })}
                                </tbody>
                            </table>
                            </div>
                    </div>
                </div>
            </div>
            <div id="popup2" className="popup">
                <div className="popupcontent">
                    <div className="popuptit">
                        <span>Detalles</span>
                        <div className="popupClose" onClick={() => { closePopup(2) }}>X</div>
                    </div>
                    <div>
                        <ul>
                            {getMemberSelect.id != null &&
                                <>
                                <li>Peso: {getMembers.data[getMemberSelect.id].appearance.weight[1]}</li>
                                <li>Altura: {getMembers.data[getMemberSelect.id].appearance.height[1]}</li>
                                <li>Nombre completo: {getMembers.data[getMemberSelect.id].biography['full-name']}</li>
                                <li>Alias: {getMembers.data[getMemberSelect.id].biography.aliases.map((value, index) => {return (index > 0 ? " / " : "") + value})}</li>
                                <li>Color de ojos: {getMembers.data[getMemberSelect.id].appearance['eye-color']}</li>
                                <li>Color de pelo: {getMembers.data[getMemberSelect.id].appearance['hair-color']}</li>
                                <li>Trabajo: {getMembers.data[getMemberSelect.id].work.occupation}</li>
                               </>
                            }
                        </ul>
                    </div>
                </div>
            </div>
            <div>
                <table className="table">
                    <thead>
                        <tr><td colSpan="4">Skill del equipo</td></tr>
                        <tr>
                            <td>Skill</td>
                            <td>Valor</td>
                        </tr>
                    </thead>
                    <tbody>
                {
                    getMembers.data.promedio().map((value, i) => {
                        return (
                        <tr key={i}>
                            <td>{value.key}</td>
                            <td>
                                <div key={i} className="stats">
                                    <Barra porcent={value.value} name={value.key}/>
                                </div>
                            </td>
                        </tr>)
                    })
                }
                </tbody>
                </table>
            
            </div>
            <table className="table">
                <thead>
                    <tr><td colSpan="4">Miembros</td></tr>
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
                        <tr key={index} className="td-se" onClick={(e) => { showDetails(e, index)}}>
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
                                <button className="btn cgreen" onClick={() => { showDetails(null, index) }}>Detalles</button>
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
            <span>{parseInt(porcent).toFixed(2)}%</span>
        </div>
    )
}