import axios from 'axios';
import {NotificationManager} from "../components/common/react-notifications";


export default {
    get: async (url, config) => {
        try{
            return await axios.get(url, config)
        }
        catch(e){
            // const message = "Something went wrong. Please try Again Later";
            // console.log(e.response);
            handleErrors(e)
            return {e}
        }
    },
    post: async (url,data, config) => {
        try{
            return await axios.post(url, data, config);
        }
        catch(e){
            // console.log(e.response);
            handleErrors(e);
            return {e}
        }
    }
}
export const handleErrors =(e) =>{
    const message = "Something went wrong. Please try Again Later";
    if(e !== undefined){
        if(e.response.status === 401){
            if(e.response.data.error !== "Unauthorised"){
                localStorage.removeItem('userToken');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('userPermission');
                window.location.reload();
            }
        }
        if(e.response.status === 403){
            let host = window.location.origin
            window.location.href = host + '/unauthorized'
        }
        if(e.response.status === 413){
            return  NotificationManager.error("File is too much large.", "Error", 3000, null, null, 'filled');
        }
        if(Array.isArray(e.response.data.errors)){
            if(e.response.data.errors.name){
                return  NotificationManager.error(e.response.data.errors.name[0], "Error", 3000, null, null, 'filled');
            }
            if(e.response.data.errors.file){
                return  NotificationManager.error(e.response.data.errors.file[0], "Error", 3000, null, null, 'filled');
            }else if(e.response.data.errors.message){
                return  NotificationManager.error(e.response.data.errors.message[0], "Error", 3000, null, null, 'filled');
            }
            else if(e.response.data.errors[0].message){
                return  NotificationManager.error(e.response.data.errors[0].message, "Error", 3000, null, null, 'filled');
            }
            if(Array.isArray(e.response.data.errors)){
                return  NotificationManager.error(e.response.data.errors[0], "Error", 3000, null, null, 'filled');
            }
        }
        if(e.response.data.errors){
            if(e.response.data.errors.name){
                return  NotificationManager.error(e.response.data.errors.name[0], "Error", 3000, null, null, 'filled');
            }
            if(e.response.data.errors.file){
                return  NotificationManager.error(e.response.data.errors.file[0], "Error", 3000, null, null, 'filled');
            }else if(e.response.data.errors.message){
                return  NotificationManager.error(e.response.data.errors.message[0], "Error", 3000, null, null, 'filled');
            }
            if(Array.isArray(e.response.data.errors)){
                return  NotificationManager.error(e.response.data.errors[0], "Error", 3000, null, null, 'filled');
            }
        }

        else if(e.response.data.message){
            return  NotificationManager.error(e.response.data.message, "Error", 3000, null, null, 'filled');
        }else if(e.response.data.error){
            return  NotificationManager.error(e.response.data.error, "Error", 3000, null, null, 'filled');
        }
    }else {
        return  NotificationManager.error(message, "Error", 3000, null, null, 'filled');
    }


}

