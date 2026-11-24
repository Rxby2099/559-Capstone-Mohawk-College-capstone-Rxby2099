import './add-char-page.css';

import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '@/lib/supabase-frontend';
import Header from "@/components/header-&-footer/header";
import Footer from "@/components/header-&-footer/footer";
import { EMPTY_FORM, validateCharacterForm, characterRow, type CharacterFormValues } from '@/lib/character-form';

const STAT_FIELDS = [
    {name: 'hp55', label: '55% HP'},
    {name: 'atk55', label: '55% ATK'},
    {name: 'def55', label: '55% DEF'},
    {name: 'hpRainbow', label: 'Rainbow HP'},
    {name: 'atkRainbow', label: 'Rainbow ATK'},
    {name: 'defRainbow', label: 'Rainbow DEF'},
] as const;

export default function AddCharacterPage(){
    const navigate = useNavigate();
    const [form, setForm] = useState<CharacterFormValues>(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>){
        const { name, value } = e.target;
        setForm({...form, [name]: value});
    }

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>){
        e.preventDefault();

        const problem = validateCharacterForm(form);
        if(problem){
            setErrMsg(problem);
            return;
        }

        setSaving(true);
        setErrMsg('');

        const {data, error } = await supabase
            .from('characters')
            .insert(characterRow(form))
            .select('id')
            .single();
            
        setSaving(false);

        if(error){
            console.error('Error creating character: ', error);
            setErrMsg('Could not create the character, please try again!');
            return;
        }

        navigate(`/characters/${data.id}`);
    }
    
    return(
        <>
            <Header/>
                <div className="characterFormContainer">
                    <h1 className='characterFormTitle'>Add Character</h1>

                    <form className='characterForm' onSubmit={handleSubmit}>
                        <label htmlFor='name'>Name</label>
                        <input id='name' name='name' type='text' maxLength={100} value={form.name} onChange={handleChange}/>
                        
                        <label htmlFor='title'>Title</label>
                        <input id='title' name='title' type='text' maxLength={100} value={form.title} onChange={handleChange}/>

                        <label htmlFor='characterClass'>Class</label>
                        <select id='characterClass' name='characterClass' value={form.characterClass} onChange={handleChange}>
                            <option value = 'super'>Super</option>
                            <option value = 'extreme'>Extreme</option>
                        </select>

                        <label htmlFor='type'>Type</label>
                        <select id='type' name='type' value={form.type} onChange={handleChange}>
                            <option value = 'agl'>AGL</option>
                            <option value = 'teq'>TEQ</option>
                            <option value = 'int'>INT</option>
                            <option value = 'str'>STR</option>
                            <option value = 'phy'>PHY</option>
                        </select>

                        <label htmlFor='leaderSkill'>Leader Skill</label>
                        <textarea id='leaderSkill' name='leaderSkill' rows={3} value={form.leaderSkill} onChange={handleChange} />

                        <fieldset>
                            <legend>Stats</legend>
                            <div className="statGrid">
                                {STAT_FIELDS.map(field => (
                                    <div key={field.name}>
                                        <label htmlFor={field.name}>{field.label}</label>
                                        <input id = {field.name} name = {field.name} 
                                            type = 'number' min = '0' step = '1' value={form[field.name]} onChange={handleChange}/>
                                    </div>
                                ))}
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>12 Ki Super Attack</legend>
                            <label htmlFor = 'superName'>Name</label>
                            <input id = 'superName' name = 'superName' type = 'text'
                                value = {form.superName} onChange={handleChange}/>
                            <label htmlFor='superDescription'>Description</label>
                            <textarea id='superDescription' name='superDescription' rows={2}
                                value = {form.superDescription} onChange={handleChange}/>
                        </fieldset>
                        
                        <label className = "checkBoxRow">
                            <input type = "checkbox" checked = {form.hasUltra}
                                onChange = {(e) => setForm({...form, hasUltra: e.target.checked})} />
                            Has an 18 Ki super attack
                        </label>

                        {form.hasUltra && (
                            <fieldset>
                                <legend>18 Ki Super Attack</legend>
                                <label htmlFor='ultraName'>Name</label>
                                <input id='ultraName' name='ultraName' type='text' 
                                    value={form.ultraName} onChange={handleChange}/>
                                <label htmlFor='ultraDescription'>Description</label>
                                <textarea id='ultraDescription' name='ultraDescription' rows={2}
                                    value = {form.ultraDescription} onChange={handleChange}/>
                            </fieldset>
                        )}
                        

                        <fieldset>
                            <legend>Passive Skill (optional)</legend>
                            <label htmlFor = 'passiveName'>Name</label>
                            <input id='passiveName' name='passiveName' type='text'
                                value={form.passiveName} onChange={handleChange}/>
                            <label htmlFor = 'passiveDescription'>Name</label>
                            <textarea id = 'passiveDescription' name = 'passiveDescription' rows={3}
                                value={form.passiveDescription} onChange={handleChange}/>
                        </fieldset>

                        {errMsg && <p role = 'alert'>{errMsg}</p>}

                        <button type = 'submit' disabled = {saving}>Create Character</button>
                    </form>
                </div>
            <Footer/>
        </>
    )
}