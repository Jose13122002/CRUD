import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {createTask, deletTask, updateTask, getTask} from '../api/tasks.api';
import {useNavigate, useParams} from 'react-router-dom';

export function TaskFormPage() {
    const {
        register,
        handleSubmit,
        formState:{errors},
        setValue
    } = useForm();
    const navigate = useNavigate();
    const params = useParams();
    
    const onSubmit = handleSubmit(async (data) => {
        if (params.id){
            await updateTask(params.id, data);
        } else {
            await createTask(data);
        }
       navigate("/tasks");
    });

    useEffect(() => {
        async function loadTask(){
            if (params.id){
                const{
                    data: {title, description},
                } = await getTask(params.id);
                setValue("title", title);
                setValue("description", description);
            }
        }
        loadTask();
    },[])

    return(
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="title" {...register("title",{required: true})}/>
                {errors.title && <span>Este campo es requerido</span>}
                <textarea rows="3" placeholder="Description" {...register("description",{required: true})}></textarea>
                {errors.description && <span>Este campo es requerido</span>}
                <button>Save</button>
            </form>

            {params.id && (<button onClick={
                async() => {const accepted = window.confirm("Estas seguro?");
                    if (accepted){
                        await deletTask(params.id);
                        navigate("/tasks");
                    }}}>Delete</button>)}
        </div>
    )
}