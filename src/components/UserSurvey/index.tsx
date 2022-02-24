import React, {Dispatch, FC, memo, SetStateAction} from 'react';
import axios from "axios";
import {useForm, SubmitHandler} from "react-hook-form";
import styles from './style.module.scss';

type Props = {
    setShowSurvey: Dispatch<SetStateAction<boolean>>;
    userIdentifier: string;
    className?: string;
};

type FormInputs = {
    name: string;
    age: number;
}

type UserSurveyDTO = FormInputs & {
    userIdentifier: string;
}

const UserSurvey: FC<Props> = ({ userIdentifier, setShowSurvey}) => {
    const {handleSubmit, register} = useForm<FormInputs>();
    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        console.log('Form data:', data, userIdentifier);
        const surveyData: UserSurveyDTO = {
            ...data,
            userIdentifier
        }
        try {
            const response = await axios.post('http://localhost:8000/user-survey', surveyData);
            console.log('User survey response', response);
            setShowSurvey(false);
        } catch (error){
            alert(error)
        }
    }
    return (
        <div className={styles['UserSurvey']}>
            <div className={styles['UserSurvey__container']}>
                <h2 className={styles['UserSurvey__title']}>Fényjáték felmérés</h2>
                <p className={styles['UserSurvey__description']}>Valami leírása a projektnek</p>
                <form onSubmit={handleSubmit(onSubmit)} className={styles['UserSurvey__form']}>
                    <div className={styles['UserSurvey__input-group']}>
                        <label htmlFor="">Name:</label>
                        <input type="text" {...register('name', {required: true})}/>
                    </div>
                    <div className={styles['UserSurvey__input-group']}>
                        <label htmlFor="age">Age:</label>
                        <input type="number" {...register('age', {required: true})}/>
                    </div>
                    <input type="submit" value="Continue"/>
                </form>
            </div>
        </div>
    );
};

export default memo(UserSurvey);
