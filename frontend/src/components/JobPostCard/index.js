import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faTrashCan} from '@fortawesome/free-solid-svg-icons';
import JobPostingAPIService from "../../pages/PostAJob/JobPostingAPIService";
import Modal from "react-modal";
import UserDropDownMenu from "../UserDropDownMenu/UserDropDownMenu";
import {UserAvatarWithText} from "../Avatars";
import CommentAPIService from "../../pages/BACKEND_DEBUG/CommentAPIService";
// import UserRESTAPI from "../../restAPI/UserAPI";
// import Cookies from 'js-cookie'
import {useUserContext} from "../../context/UserContext";

export const CardTitle = styled.h1`
    font-size: 2em;
`;
export const CardGivenTitle = styled.h4`
    font-size: 1.25em;
`;
export const CardArticle = styled.div`
    border: 1px solid darkblue;
    margin: 10px;
    width: 100%;
    align-self: stretch;
`;
export const CardText = styled.p`
`;
export const CardDate = styled.b`
`;
export const CardDeleteButton = styled.button`
    float: right;
    margin-right: 3.5em;
    font-size: 2ch;
    background: none;
    color: red;
    
    
`;
export const CardEditButton = styled.button`
    float: right;
    margin-right: 3.5em;
    font-size: 2ch;
    background: none;
    color: green;
    
`;

export const SubmitCancelButton = styled.button`
    margin: 1.5em;
    font-size: 2ch;
    text-align: center;
    width: 5em;
    color: black;
`;

export const CardApplyButton = styled.button`
  & {
    box-shadow: 5px 6px 1px -1px #d98c73;
    background: linear-gradient(to bottom, #ff7b08 5%, #bc3315 100%);
    background-color: #ff7b08;
    border-radius: 3px;
    float: right;
    border: 1px solid #942911;
    display: inline-block;
    cursor: pointer;
    color: #ffffff;font-size: 16px;
    font-style: italic;
    padding: 15px 24px;
    text-decoration: none;
    text-shadow: 0px 1px 9px #854629;
  }

  &:hover {
    background: linear-gradient(to bottom, #bc3315 5%, #ff7b08 100%);
    background-color: #bc3315;
  }

  &:active {
    position: relative;
    top: 1px;
  }

`;

export const CardCommentButton = styled.button`
  & {
    box-shadow: inset 5px 6px 1px -1px #ba7059;
    background-color: #de8042;
    border-radius: 3px;
    border: 1px solid #ffffff;
    display: inline-block;
    cursor: pointer;
    float: right;
    color: #ffffff;
    font-family: Arial;
    font-size: 16px;
    font-style: italic;
    padding: 15px 24px;
    margin-bottom: 10px;
    margin-right: 10px;
    text-decoration: none;
    text-shadow: 0px 1px 9px #854629;
  }

  &:hover {
    background-color: #db9183;
  }

  &:active {
    position: relative;
    top: 1px;
  }


`;

const JobPostCard = ({id, jobtype, title, description, location, salary, tags, date, editDate,employerUid}) => {

    const {state} = useUserContext();

    const [editJobType, setJobType] = useState(jobtype);
    const [editJobTitle, setJobTitle] = useState(title);
    const [editLocation, setLocation] = useState(location);
    const [editSalary, setSalary] = useState(salary);
    const [editIndustryTags, setIndustryTags] = useState(tags.split(","));
    const [editJobDescription, setJobDescription] = useState(description);
    const [wordCount, setWordCount] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [toBeEditedID, setToBeEditedID] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const [employerUser,setEmployerUser] = useState([{}])

    useEffect(
        ()=> {
            CommentAPIService.GetUserDetails(
                employerUid
            ).then(
                (data) => {
                    setEmployerUser(data)
                }
            )
        },
        [employerUid] //effect hook only called on mount since empty dependencies array
    )


    const handleJobTypeChange = (type) => {
        setJobType(type);
    };

    const handleSalaryChange = (event) => {
        setSalary(event.target.value);
    };

    const addIndustryTag = (tag) => {
        if (editIndustryTags.length < 3 && tag) {
            setIndustryTags([...editIndustryTags, tag]);
        }
    };

    const handleIndustryTagClick = (event) => {
        if (event.key === 'Enter') {
            const tag = event.target.value.trim();
            addIndustryTag(tag);
            event.target.value = '';
            event.preventDefault();
        }
    };

    const handleExampleTagClick = (tag) => {
        addIndustryTag(tag);
    };

    const handleRemoveIndustryTag = (index) => {
        setIndustryTags(editIndustryTags.filter((_, i) => i !== index));
    };

    const handleJobDescriptionChange = (event) => {
        const description = event.target.value;
        var maxWords = 350;
        var wordCount = description.split(/\s+/).length;
        if (wordCount>maxWords) {
            description.preventDefault()
        }
        else{
            setJobDescription(description);
            setWordCount(description.split(/\s+/).length);
        }
    };

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const handleEdit = (event) => {

        JobPostingAPIService.EditJobPosting(toBeEditedID,
            {"title" : editJobTitle, "jobtype": editJobType, "location": editLocation, "salary": editSalary, "description": editJobDescription, "tags": editIndustryTags.toString()}
        )
            //.then((response) => props.postedComment(response))
            .then((any)=> window.location.reload())
            .catch(error => console.log('Following error occured after fetching from API: ',error))
        setJobType('')
        setJobTitle('')
        setLocation('')
        setSalary(0)
        setIndustryTags([])
        setJobDescription('')
    };

    const HandleApply = (event) => {
        const applicantName = window.localStorage.firstName + " " + window.localStorage.lastName;
        JobPostingAPIService.sendNotification({"email": employerUser.email, "applicant_name": applicantName, "job_title": title})
            .then((any)=> window.location.reload())
            .catch(error => console.log('Following error occurred after fetching from API: ',error))
    }

    return (<>
        <CardArticle>
            {
                                        <UserDropDownMenu
                    triggerMenuMarkup={UserAvatarWithText(employerUser,0)}
                    triggeredUserUid={employerUid}
                    />
                }

            <CardTitle>Job post ID#{id} </CardTitle>
            {

                (state.userData && (state.userData.uid === employerUid
                                    || state.userData.userType === "ADMIN"))
                &&
                <section>
                  <CardDeleteButton onClick={() => handleDelete(id)}><FontAwesomeIcon icon={faTrashCan}/></CardDeleteButton>
                <CardEditButton onClick={() => {setToBeEditedID(id); toggleModal(); setJobTitle(editJobTitle); setJobDescription(editJobDescription)}}><FontAwesomeIcon icon={faPen}/></CardEditButton>
            </section>
            }


            <CardGivenTitle >{title}</CardGivenTitle>

            <CardText>Type: {jobtype}</CardText>

            <CardText>Location: {location}</CardText>

            <CardText>Salary: {salary}</CardText>

            <CardText>Tags: {tags}</CardText>

            <CardText>Description: {description}</CardText>

            <CardDate>Date Posted: {date}
            </CardDate>
            <CardText></CardText>
            <CardDate>{editDate !== "Invalid Date" ? "Date Edited: " + editDate : ""}
            </CardDate>
            <CardCommentButton> Leave a comment </CardCommentButton>
            {
                //TODO: Make checks to see if already in applied list !
                (state.userData && state.userData.userType === "APPLICANT") &&
                <CardApplyButton  onClick={(e) => {HandleApply(id, employerUid)}}>  Apply </CardApplyButton>
            }


        </CardArticle>
        <Modal isOpen={isOpen} onRequestClose={toggleModal} ariaHideApp={false}>
            <form onSubmit={() => {handleEdit(); toggleModal()}}>
                <br/><br/>
                <label>
                    Job Type:
                    <div className="job-type-section">
                        <h3>Job Type</h3>
                        <button type="button"
                            className={editJobType === 'Full-Time' ? 'active' : ''}
                            onClick={() => handleJobTypeChange('Full-Time')}
                        >
                            Full-Time
                        </button>
                        <button type="button"
                            className={editJobType === 'Part-Time' ? 'active' : ''}
                            onClick={() => handleJobTypeChange('Part-Time')}
                        >
                            Part-Time
                        </button>
                        <button type="button"
                            className={editJobType === 'Time-Period' ? 'active' : ''}
                            onClick={() => handleJobTypeChange('Time-Period')}
                        >
                            Time-Period
                        </button>
                    </div>
                </label>
                Job Title:
                <input
                    type="text"
                    name="jobTitle"
                    id="jobTitle"
                    onChange={(e) => setJobTitle(e.target.value)}
                    value={editJobTitle}
                />
                Job Location:
                <input
                    type="text"
                    name="location"
                    id="location"
                    onChange={(e) => setLocation(e.target.value)}
                    value={editLocation}
                />
                <label htmlFor="salary-input">Salary</label>
                <div className="salary-section">
                    <input
                        id="salary-input"
                        type="range"
                        min="100"
                        max="10000"
                        step="100"
                        value={editSalary}
                        onChange={handleSalaryChange}
                    />
                    <span className="salary-display">${editSalary}</span>
                </div>
                <label htmlFor="industry-tags-input">Industry Tags</label>
                <div className="industry-tags-section">
                    <div className="industry-tags-example">
                        <span onClick={() => handleExampleTagClick('IT')}>IT</span>
                        <span onClick={() => handleExampleTagClick('Tutoring')}>Tutoring</span>
                        <span onClick={() => handleExampleTagClick('Engineering')}>Engineering</span>
                        <span onClick={() => handleExampleTagClick('Finance')}>Finance</span>
                        <span onClick={() => handleExampleTagClick('Marketing')}>Marketing</span>
                        <span onClick={() => handleExampleTagClick('Design')}>Design</span>
                        <span onClick={() => handleExampleTagClick('Healthcare')}>Healthcare</span>
                        <span onClick={() => handleExampleTagClick('Education')}>Education</span>
                        <span onClick={() => handleExampleTagClick('Food')}>Food</span>
                        <span onClick={() => handleExampleTagClick('Travel')}>Travel</span>
                    </div>
                    <div className="industry-tags-input-wrapper">
                        {editIndustryTags.map((tag, index) => (
                            <div key={index} className="industry-tag">
                                {tag}
                                <button onClick={() => handleRemoveIndustryTag(index)}>x</button>
                            </div>
                        ))}
                        <input
                            id="industry-tags-input"
                            type="text"
                            placeholder="Add an industry tag"
                            onKeyPress={handleIndustryTagClick}
                            disabled={editIndustryTags.length >= 3} // Add the disabled attribute here
                        />
                    </div>
                </div>
                <label>
                    Job Description:
                    <textarea
                        id="job-description-input"
                        value={editJobDescription}
                        onChange={handleJobDescriptionChange}
                        required
                    />
                    <p className="word-count">{wordCount}/350 words</p>
                </label>
                <SubmitCancelButton type="submit">Submit</SubmitCancelButton>
                <SubmitCancelButton onClick={() => toggleModal()}>Cancel</SubmitCancelButton>
            </form>
            <form onClose={toggleModal} />
        </Modal>
    </>);};

const handleDelete = (job_id) => {
    //event.preventDefault();

    JobPostingAPIService.DeleteJobPosting(job_id)
        .then((any)=> window.location.reload())
        .catch(error => console.log('Following error occured after fetching from API: ',error))

    //console.log(window.location.href);

};




export default JobPostCard;
