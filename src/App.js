import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App(){
  const [show, setShow] = useState(false)
  const [friends, setFriends] = useState(initialFriends)
  const [selected, setSelected] = useState(null)

  const handleClick = () => {
    setShow(show => !show)
  }
  const handleNewFriend = (newFriend) => {
    setFriends(friends => [...friends, newFriend])
    setShow(false)
  }
  const handleSelect = (friend) => {
    setSelected(selected => selected?.id === friend.id ? null : friend)
  }
  const handleBillSplit = (value) => {
    setFriends(friends => friends.map(friend => friend.id === selected.id ? {...friend, balance: friend.balance + value} : friend))
    setSelected(null)
  }
  const handleRemove = (id) => {
    setFriends(friends => friends.filter(friend => friend.id !== id))
  }
  return <div className="app">
      <div className="sidebar">
        <FriendList  friends={friends} selected = {selected} onSelect={handleSelect} onRemove = {handleRemove}/>
        { show ? selected ? null : <FormAddFriend onAddFriend={handleNewFriend} /> : null}
        <Button onClick={handleClick}> {show ? selected ? 'Add Friend': 'Close' : 'Add Friend' } </Button>
      </div>
      {selected && <FormSplitBill selected = {selected} onSplit = {handleBillSplit} onSubmit={setSelected} />}
  </div>
}
function FriendList ({friends, selected, onSelect, onRemove}){
  return <ul>
    {friends.map(el => <Friend friend = {el} selected = {selected} onSelect = {onSelect} onRemove = {onRemove} key={el.id}/>)}
  </ul>
}
function Friend ({friend, selected, onSelect, onRemove}){
  const isSelected = selected?.id === friend.id
  return <li className= {isSelected ? 'selected' : ''}>
    <img src = {friend.image} alt= {friend.name}/>
    <h3>{friend.name}</h3>
    {friend.balance < 0 && <p className="red"> You owe {friend.name} {Math.abs(friend.balance)}€ </p>}
    {friend.balance === 0 && <p> You and {friend.name} are even </p>}
    {friend.balance > 0 && <p className="green">{friend.name} owes you {Math.abs(friend.balance)}€ </p>}
    <Button onClick = {() => onSelect(friend)}> {isSelected ? 'close': 'Select'} 
    </Button> 
    <Button onClick={() => onRemove(friend.id)}> remove</Button>
  </li>
}
function FormAddFriend({onAddFriend}){
  const [name, setName] = useState("")
  const [image, setImage] = useState('https://i.pravatar.cc/48')
  function handleClick (e){
    e.preventDefault()
    const id = crypto.randomUUID()
    const newFriend = {id, name, image:`${image}?=${id}`, balance: 0}
    onAddFriend(newFriend)
    setName("")
    setImage('https://i.pravatar.cc/48')
  }
  return <form className="form-add-friend" onSubmit={handleClick}>
    🧑‍🤝‍🧑 Friend name 
    <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
    🖼️ Image 
    <input type="url" value={image} onChange={(e) => setImage(e.target.value)}/>

    <Button> Add </Button>

  </form>
}
function Button ({children, onClick}){
  return <button className="button" onClick = {onClick}> {children} </button>
}

function FormSplitBill ({selected, onSplit}){
  const [bill, setBill] = useState("")
  const [myExpense, setMyExpense] = useState("")
  const friendExpense = bill ? Math.abs(bill - myExpense) : ""
  const [payed, setPayed] = useState("user")
  const difference = payed === "user" ? friendExpense : -myExpense
  function handleBillSubmit(e){
    e.preventDefault()
    // Guard Clause
    if(!bill || !myExpense ) return
    onSplit(difference) 
  }
  return <form className="form-split-bill" onSubmit= {handleBillSubmit}>
    <h2> Split Bill with {selected.name} </h2>

    <label> 💰bill value  </label>
    <input type="number" value = {bill} onChange = {e => setBill(+e.target.value)}/>

    <label> 🧍🏻‍♂️your expense </label>
    <input type="number" value={myExpense} onChange={e => setMyExpense((+e.target.value > bill ? "" : +e.target.value ))}/>

    <label> 🧑‍🤝‍🧑{selected.name}'s expense </label>
    <input type="number" value = {friendExpense} onChange={() => {}}/>
    
    <label> 🤑 who will pay the bill? </label>
    <select value = {payed} onChange={e => setPayed(e.target.value)}>
      <option value = "user"> you </option>
      <option value = "friend"> {selected.name} </option>
    </select>
    <Button> split Bill </Button>
  </form>
}