import { Search } from "lucide-react"

import "./css/styles.css"

export type SearchBarProps = {
  placeholder?: string
  onChangeText?: (text: string) => unknown
}

export const SearchBar = ({ placeholder, onChangeText }: SearchBarProps) => {
  return (
    <div className="input-container">
      <div className="icon-area">
        <Search />
      </div>  
      <input 
        type="text"
        placeholder={ placeholder }
        onChange={ onChangeText ? (e) => onChangeText(e.target.value) : undefined }
      />
    </div>
  )
}
