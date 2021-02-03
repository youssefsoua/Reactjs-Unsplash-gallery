import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import axios from 'axios'
import './App.css'
import unsplash from './unsplash.png'

function App() {
  const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY
  const [images, setImages] = useState([])
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')

  useEffect(() => {
    getImages()
  }, [page])

  const getImages = async () => {
    let apiUrl = `https://api.unsplash.com/photos?`
    if (query) apiUrl = `https://api.unsplash.com/search/photos?query=${query}`
    apiUrl += `&page=${page}`
    apiUrl += `&client_id=${accessKey}`

    try {
      let data = await axios.get(apiUrl)
      let newImages = data.data.results ?? data.data
      if (page === 1) {
        setImages(newImages)
        return
      }
      setImages((images) => [...images, ...newImages])
    } catch (error) {
      console.log(error)
    }
  }
  const searchHabdler = (e) => {
    e.preventDefault()
    setPage(1)
    setImages([])
    getImages()
  }
  if (!accessKey) {
    return (
      <a href='https://unsplash.com/developers' className='error'>
        Required: Get Your Unsplash API Key First
      </a>
    )
  }
  return (
    <div className='container'>
      <form className='header' onSubmit={searchHabdler}>
        <div className='logo'>
          <img className='logo-img' src={unsplash} alt='Usplash' />
        </div>

        <div className='title-container'>
          <h1 className='title'>Unsplash Image Gallery!</h1>
        </div>

        <div className='search-box'>
          <input
            type='text'
            placeholder='Search Unsplash...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button>Search</button>
        </div>
      </form>

      <InfiniteScroll
        dataLength={images.length}
        next={() => {
          setPage(page + 1)
        }}
        hasMore={true}
        loader={<h4>Loading...</h4>}
      >
        <div className='images-grid'>
          {images.map((image, index) => (
            <a
              className='image'
              key={index}
              href={image.links.html}
              target='_blank'
              rel='noopener noreferrer'
            >
              <img src={image.urls.regular} alt={image.alt_description} />
            </a>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  )
}

export default App
