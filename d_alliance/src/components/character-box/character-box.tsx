import './character-box.css'

type CharacterBoxImg = {
    image: string;
}

export default function CharacterBox({image}: CharacterBoxImg){
    return(
        <div id = "charBox">
            <img src={image} alt ="character" />
        </div>
    )
}