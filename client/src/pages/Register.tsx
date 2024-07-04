import {Fragment, useState} from "react";
import {SubmitHandler, useForm} from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod";
import {RegisterFormSchema, RegisterFormType} from "../types/Register.ts";
import {useMutation} from "@tanstack/react-query";
import {bashApi} from "../api/bashApi.tsx";
import {AxiosError, AxiosResponse} from "axios";
import {toast} from 'sonner'
import {NavigateFunction, useNavigate} from "react-router-dom";
import {AxiosOMessageResponse} from "../features/UserProvider.tsx";
import {UserProfileType} from "../types/User.ts";
import Loading from "../component/Loading.tsx";
import useProfile from "../features/useProfile.ts";


const Register = () => {
    const navigate: NavigateFunction = useNavigate();
    const {setProfile} = useProfile()

    const [viewPassword, setViewPassword] = useState<boolean>(false);
    const [viewCPassword, setViewCPassword] = useState<boolean>(false);

    const {
        register
        , handleSubmit
        , formState: {errors, isValid}
    } = useForm<RegisterFormType>({resolver: zodResolver(RegisterFormSchema)})

    const registerMutation = useMutation<AxiosResponse<UserProfileType>, AxiosError<AxiosOMessageResponse>, RegisterFormType>({
        mutationFn: (data: RegisterFormType) => {
            return bashApi.post('/user/register', data)
        },
        onSuccess: (response) => {
            toast.info("User successfully registered!");
            setProfile(response.data)
            navigate('/verifyOTP')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "An error occurred. Please try again later.")
        },
    })

    if (registerMutation.isPending){
        return <Loading/>;
    }

    const onSubmit: SubmitHandler<RegisterFormType> = async (data: RegisterFormType) => {
        if (isValid) {
            registerMutation.mutate(data);
        }
    }

    return <Fragment>
        <form className={'text-gray-50'} onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    {...register("name", {required: true})}
                    placeholder="John dev"
                    type="text"
                    id="name"
                    className={'text-gray-950'}
                />
                {errors.name && <p className="error-message">{errors.name?.message}</p>}
            </div>

            <div>
                <label htmlFor="email">Email:</label>
                <input
                    {...register("email", {required: true})}
                    placeholder="xyz@gmail.com"
                    type="email"
                    id="email"
                    className={'text-gray-950'}
                />
                {errors.email && (
                    <p className="error-message">{errors.email?.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="picture">Picture Link</label>
                <input
                    {...register("picture", {required: true})}
                    placeholder="profile.png"
                    type="text"
                    id="picture"
                    className={'text-gray-950'}
                />
                {errors.picture && (
                    <p className="error-message">{errors.picture?.message}</p>
                )}
            </div>


            <div className={'w-fit'}>
                <label htmlFor="password">Password:</label>
                <input
                    {...register("password", {required: true})}
                    type={viewPassword ? "text" : "password"}
                    id="password"
                    placeholder="profile.png"
                    className={'text-gray-950'}
                />
                <button type={'button'} onClick={() => setViewPassword(prevState => !prevState)}>👁️</button>
                {errors.password && (
                    <p className="error-message">{errors.password?.message}</p>
                )}
            </div>


            <div>
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                    {...register("confirmPassword", {required: true})}
                    type={viewCPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="profile.png"
                    className={'text-gray-950'}
                />
                <button type={'button'} onClick={() => setViewCPassword(prevState => !prevState)}>👁️</button>

                {errors.confirmPassword && (
                    <p className="error-message">{errors.confirmPassword?.message}</p>
                )}
            </div>
            <div>
                <input
                    {...register("tac")}
                    type="checkbox"
                    id="checkbox"
                    className={'text-gray-950'}
                />
                {errors.tac && <p>{errors.tac?.message}</p>}
            </div>

            <button type='submit'>
                Register
            </button>
        </form>
    </Fragment>
}
export default Register;