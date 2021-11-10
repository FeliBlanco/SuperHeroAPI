import { useFormik } from 'formik';
import axios from 'axios'

import './index.css'
import { useEffect } from 'react';
export default function Login() {

    useEffect(() => {
        if(localStorage.getItem("token") != null) {
            window.location.href = "/"
            return 1;
        }
    }, [])

    const validate = values => {
        const errors = {}
        if(!values.email) {
            errors.email = "Ingresa un correo valido"
        } else if(values.email.length <= 4 || !values.email.includes("@") || !values.email.includes(".")) {
            errors.email = "Ingresa un email valido"
        }

        if(!values.pass) {
            errors.pass = "Ingresa una contraseña"
        } else if(values.pass.length <= 3) {
            errors.pass = "Ingresa una contraseña valida"
        }

        return errors;
    }
    const formik = useFormik({
        initialValues: {
          email: '',
          pass:''
        },
        validate,
        onSubmit: values => {
            axios({
                method:'POST',
                url:'http://challenge-react.alkemy.org/',
                data: {
                    email: values.email,
                    password: values.pass
                }
            }).then(res => {
                if(res.status == 200) {
                    const token = res.data.token;
                    localStorage.setItem("token", token)
                    window.location.href = "/";
                } else {
                    alert("No existe ningun usuario con esos datos")
                }
            })
        },
      });

    return (
        <div className="login">
            <form onSubmit={formik.handleSubmit}>
                <div className="login-tit">Iniciar sesion</div>
                <div className="login-inpt">
                    <label htmlFor="email">Correo</label><br/>
                    <input id="email" name="email" type="email" onChange={formik.handleChange} value={formik.values.email}/><br/>
                    {formik.errors.email ? <div className="msg-er">{formik.errors.email}</div> : null}
                </div>
                <div className="login-inpt">
                    <label htmlFor="pass">Contraseña</label><br/>
                    <input id="pass" name="pass" type="password" onChange={formik.handleChange} value={formik.values.pass}/><br/>
                    {formik.errors.pass ? <div className="msg-er">{formik.errors.pass}</div> : null}
                </div>
                <button type="submit" className="btn-s">Ingresar</button>
            </form>
        </div>
    )
}