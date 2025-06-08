import { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast, Slide } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid';

const PassManager = () => {
  const passRef = useRef()
  const eyeRef = useRef()

  const [formData, setFormData] = useState({
    id: '',
    website: '',
    username: '',
    password: ''
  })

  const [passwords, setPasswords] = useState([])
  const [edit, setEdit] = useState({status: false, id: ''})

  useEffect(() => {
    async function getPasswords() {
      let r = await fetch('http://localhost:3000/api/get')
      setPasswords(await r.json())
    }
    getPasswords()
  }, [])

  const showPassword = () => {
    if (eyeRef.current.innerHTML === 'visibility') {
      eyeRef.current.innerHTML = 'visibility_off'
      passRef.current.type = 'text'
    } else {
      eyeRef.current.innerHTML = 'visibility'
      passRef.current.type = 'password'
    }
  }

  const savePassword = async () => {
    if (!formData.website || !formData.username || !formData.password) {
      toast.error('Atleast one of the input fields is/are empty!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Slide,
      });
    } else {
      let newPasswords;
      if (!edit.status) {
        formData.id = uuidv4()
        newPasswords = [...passwords, formData]
        console.log(formData)
        await fetch('http://localhost:3000/api/insert', {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json"
          },
        })
      } else {
        newPasswords = [...passwords]
        let index = newPasswords.findIndex(item => item.id === edit.id)
        newPasswords[index] = formData
        await fetch('http://localhost:3000/api/update', {
          method: "PATCH",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json"
          },
        })
        setEdit({status: false, id: ''})
      }
      setPasswords(newPasswords)
      clearInputs()
      toast.success('Password saved!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Slide,
      });
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const clearInputs = () => {
    if (edit.status) {
      setEdit({status: false, id: ''})
    }
    setFormData({ id: '', website: '', username: '', password: '' })
  }

  const deleteRow = async (id) => {
    if (confirm("Are you sure you want to delete the entry?")) {  
      let newPasswords = [...passwords].filter(item => item.id !== id);
      setPasswords(newPasswords)
      await fetch('http://localhost:3000/delete', {
        method: "DELETE",
        body: JSON.stringify({id}),
        headers: {
          "Content-Type": "application/json"
        },
      })
      toast.success('Password deleted!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Slide,
      });
    }
  }

  const editRow = (id) => {
    setFormData(passwords.find(item => item.id === id))
    setEdit({status: true, id})
  }

  const copyText = (text) => {
    navigator.clipboard.writeText(text)
    toast.info('Copied to clipboard!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      transition: Slide,
    });
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
      />
      <div className='content h-[calc(100vh-180px)] sm:h-[calc(100vh-122px)] flex flex-col justify-start items-center'>
        <div className='pass-manager w-full lg:w-[65vw] h-full p-5 lg:p-10 flex flex-col gap-17'>
          <div className='grid grid-rows-4 sm:grid-cols-[3fr_1fr] lg:grid-rows-2'>
            <input type='text' className='input-field' placeholder='Username' name='username' value={formData.username} onChange={handleChange} />
            <div className='relative flex items-center justify-between lg:justify-center'>
              <input ref={passRef} type='password' className='w-full input-field' placeholder='Password' name='password' value={formData.password} onChange={handleChange} />
              <span ref={eyeRef} className='show-pass-btn material-symbols-rounded absolute right-6 top-4.5 hover:cursor-pointer' onClick={showPassword}>visibility</span>
            </div>
            <input type='text' className='input-field' placeholder='Website' name='website' value={formData.website} onChange={handleChange} />
            <div className='action-btns p-2 flex justify-evenly'>
              <button className='action-btn' onClick={savePassword}>
                <span className='material-symbols-rounded'>new_window</span>
                <span>Save</span>
              </button>
              <button className='action-btn' onClick={clearInputs}>
                <span className='material-symbols-rounded'>ink_eraser</span>
                <span>Clear</span>
              </button>
            </div>
          </div>
          <div className={'stored-passwords' + (passwords.length === 0 ? ' h-full flex flex-col items-center justify-center gap-5' : '')}>
            {passwords.length !== 0 ?
              <table className='table-auto w-full'>
                <thead className='text-2xl'>
                  <tr>
                    <th className='py-2'>Website</th>
                    <th className='py-2'>Username</th>
                    <th className='py-2'>Password</th>
                    <th className='w-30 py-2'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {passwords.map(row => {
                    return (
                      <tr key={row.id}>
                        <td className='p-1.5 border border-[#454545]'>
                          <div className='flex items-center justify-between'>
                            <a href={((row.website.startsWith('https://www.') || row.website.startsWith('www.') || row.website.startsWith('http://www.')) ? '' : 'https://www.') + row.website} target='_blank'>{row.website}</a>
                            <span className='material-symbols-rounded row-action-btn' onClick={() => { copyText(row.website) }}>content_copy</span>
                          </div>
                        </td>
                        <td className='p-1.5 border border-[#454545]'>
                          <div className='flex items-center justify-between'>
                            <span>{row.username}</span>
                            <span className='material-symbols-rounded row-action-btn' onClick={() => { copyText(row.username) }}>content_copy</span>
                          </div>
                        </td>
                        <td className='p-1.5 border border-[#454545]'>
                          <div className='flex items-center justify-between'>
                            <span>{'\u2022'.repeat(row.password.length)}</span>
                            <span className='material-symbols-rounded row-action-btn' onClick={() => { copyText(row.password) }}>content_copy</span>
                          </div>
                        </td>
                        <td className='p-1.5 border border-[#454545]'>
                          <div className='flex items-center justify-evenly'>
                            <span className='material-symbols-rounded row-action-btn' onClick={() => { editRow(row.id) }}>edit</span>
                            <span className='material-symbols-rounded row-action-btn' onClick={() => { deleteRow(row.id) }}>delete</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table> : <><div className='material-symbols-rounded' style={{"fontSize": "48px"}}>database_off</div><div className='text-xl'>No passwords to show</div></>}
          </div>
        </div>
      </div>
    </>
  )
}

export default PassManager
