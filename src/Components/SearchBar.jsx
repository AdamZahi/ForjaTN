function SearchBar(props){
    return (
        <div className="search">
            <div>
            <img src="search.svg" alt="search icon" />
            <input type="text" 
            value={props.searchTerm} 
            placeholder="Search through 300+ Movies and Series online"
            onChange={(e)=>props.setSearchTerm(e.target.value)} />
            </div>
        </div>
        
    );
}
export default SearchBar;