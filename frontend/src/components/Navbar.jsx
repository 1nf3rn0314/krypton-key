const Navbar = () => {
  return (
    <nav className='bg-transparent flex justify-start sm:justify-around items-center h-15 p-3'>
      <div className='brand flex gap-3 items-center'>
        <img src='/icon.svg' alt='brand-icon' />
        <div className='brand-name font-bold text-2xl'>KryptonKey</div>
      </div>
      <div className='links hidden sm:flex gap-10 items-center'>
        <div className='hover:cursor-pointer hover:underline decoration-2'>Home</div>
        <div className='hover:cursor-pointer hover:underline decoration-2'>About Us</div>
        <div className='hover:cursor-pointer hover:underline decoration-2'>Contact</div>
      </div>
    </nav>
  )
}
export default Navbar
