import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const ProfileDetails = () => {
  const [profileData, setProfileData] = useState({})
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)

  useEffect(() => {
    getProfile()
    // eslint-disable-next-line
  }, [])

  const getProfile = async () => {
    setApiStatus(apiStatusConstants.inProgress)

    const token = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    })

    if (response.ok === true) {
      const data = await response.json()
      const updatedProfile = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      setProfileData(updatedProfile)
      setApiStatus(apiStatusConstants.success)
    } else {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  const renderProfileView = () => {
    const {name, profileImageUrl, shortBio} = profileData

    return (
      <div className="profile-success-container">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-heading">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
        <h1 className="profile-heading">Koppolu Koushik</h1>
        <p className="profile-bio">Frontend Developer</p>
      </div>
    )
  }

  const renderFailureView = () => (
    <div className="profile-error-view-container">
      <button
        type="button"
        data-testid="button"
        className="profile-failure-button"
        onClick={getProfile}
      >
        Retry
      </button>
    </div>
  )

  const renderLoadingView = () => (
    <div className="profile-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  const renderProfileDetails = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderProfileView()
      case apiStatusConstants.failure:
        return renderFailureView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }

  return <>{renderProfileDetails()}</>
}

export default ProfileDetails
