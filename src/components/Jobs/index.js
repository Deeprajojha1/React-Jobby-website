import {Component} from "react"
import Cookies from "js-cookie"
import Loader from "react-loader-spinner"
import {BsSearch} from "react-icons/bs"
import Header from "../Header"
import FiltersGroup from "../FiltersGroup"
import JobCard from "../JobCard"

import "./index.css"

const employmentTypesList = [
  {label: "Full Time", employmentTypeId: "FULLTIME"},
  {label: "Part Time", employmentTypeId: "PARTTIME"},
  {label: "Freelance", employmentTypeId: "FREELANCE"},
  {label: "Internship", employmentTypeId: "INTERNSHIP"},
]

const salaryRangesList = [
  {salaryRangeId: "1000000", label: "10 LPA and above"},
  {salaryRangeId: "2000000", label: "20 LPA and above"},
  {salaryRangeId: "3000000", label: "30 LPA and above"},
  {salaryRangeId: "4000000", label: "40 LPA and above"},
]

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
}

class Jobs extends Component {
  state = {
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
    employeeTypeList: [],
    minimumSalary: "",
    searchInput: "",
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {employeeTypeList, minimumSalary, searchInput} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employeeTypeList.join(
      ",",
    )}&minimum_package=${minimumSalary}&search=${searchInput}`

    const jwtToken = Cookies.get("jwt_token")
    const response = await fetch(apiUrl, {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: "GET",
    })

    if (response.ok) {
      const data = await response.json()
      const updatedJobsData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        jobsList: updatedJobsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobsList = () => {
    const {jobsList} = this.state

    return jobsList.length > 0 ? (
      <div className="all-jobs-container">
        <ul className="jobs-list">
          {jobsList.map(job => (
            <JobCard jobData={job} key={job.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-jobs-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs-img"
        />
        <p className="no-jobs-description">
          We could not find any jobs. Try other filters
        </p>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="jobs-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-img"
      />
      <p className="jobs-failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderAllJobs = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsList()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  changeSalary = salaryRangeId => {
    this.setState({minimumSalary: salaryRangeId}, this.getJobs)
  }

  changeEmployeeList = type => {
    const {employeeTypeList} = this.state

    if (!employeeTypeList.includes(type)) {
      this.setState(
        prev => ({employeeTypeList: [...prev.employeeTypeList, type]}),
        this.getJobs,
      )
    } else {
      this.setState(
        {
          employeeTypeList: employeeTypeList.filter(
            eachItem => eachItem !== type,
          ),
        },
        this.getJobs,
      )
    }
  }

  changeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearchInput = event => {
    if (event.key === "Enter") {
      this.getJobs()
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="jobs-content">
            <FiltersGroup
              employmentTypesList={employmentTypesList}
              salaryRangesList={salaryRangesList}
              changeSearchInput={this.changeSearchInput}
              searchInput={searchInput}
              getJobs={this.getJobs}
              changeSalary={this.changeSalary}
              changeEmployeeList={this.changeEmployeeList}
            />

            <div className="search-input-jobs-list-container">
              <div className="search-input-container-desktop">
                <input
                  type="search"
                  role="searchbox"   {/* ✅ REQUIRED */}
                  className="search-input-desktop"
                  placeholder="Search"
                  value={searchInput}
                  onChange={this.changeSearchInput}
                  onKeyDown={this.onEnterSearchInput}
                />
                <button
                  type="button"
                  data-testid="searchButton"
                  className="search-button-container-desktop"
                  onClick={this.getJobs}
                >
                  <BsSearch className="search-icon-desktop" />
                </button>
              </div>
              {this.renderAllJobs()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
