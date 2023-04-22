import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { GrClose } from "react-icons/gr";
import { MdSubdirectoryArrowRight } from "react-icons/md";
import { useContext } from "react";
import { CurrentUserContext } from "./CurrentUserContext";
import { ProfileStyledButton } from "./Profile";

const ListingUserCommentsModal = ({ setShowCommentModal }) => {
  const { currentUser } = useContext(CurrentUserContext);
  const [showReplyState, setShowReplyState] = useState(false);
  const [commentorUsername, setCommentorUsername] = useState(null);
  const [replyFlag, setReplyFlag] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [commentFormObject, setCommentFormObject] = useState({
    listingId: currentUser._id,
    comment: null,
    reply: null,
    commentId: null,
    username: currentUser.nickname,
  });

  useEffect(() => {
    fetch(`/listings/getSingleListing/${currentUser._id}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedElement(data.data);
        // console.log(data.data);
      })
      .catch((e) => {
        console.log("Error: ", e);
      });
  }, [replyFlag]);
  console.log(selectedElement);

  const handleCommentSubmit = (e, comment, type) => {
    e.preventDefault();
    // console.log(comment);
    fetch(`/listings/comments/postComment`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify(commentFormObject),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.status === 200) {
          setReplyFlag(!replyFlag);
          setCommentFormObject({
            listingId: selectedElement._id,
            comment: null,
            reply: null,
            commentId: null,
            username: currentUser.nickname,
          });
        }
      });
  };
  return (
    <CommentModalContainer>
      <CommentInfoContainer>
        <GrClose
          style={{
            cursor: "pointer",
            fontSize: "35px",
            position: "absolute",
          }}
          onClick={() => {
            setShowCommentModal(false);
          }}
        />
        {selectedElement && (
          <>
            {!selectedElement.comments ||
              (selectedElement.comments.length < 1 && (
                <CommentFeedDiv>No comments yet...</CommentFeedDiv>
              ))}
            {selectedElement.comments &&
              selectedElement.comments.length > 0 && (
                <CommentFeedDiv>
                  {selectedElement.comments.map((comment, index) => {
                    return (
                      <div key={index}>
                        <IndividualCommentDiv>
                          <p style={{ fontWeight: "500", marginBottom: "3px" }}>
                            "{comment.username}" asked:
                          </p>
                          <p style={{ paddingLeft: "15px" }}>
                            {comment.comment}
                          </p>
                          {selectedElement._id === currentUser._id && (
                            <p
                              style={{ color: "blue", cursor: "pointer" }}
                              onClick={() => {
                                setCommentorUsername(comment.username);
                                setCommentFormObject({
                                  ...commentFormObject,
                                  commentId: comment.id,
                                });
                                setShowReplyState(true);
                              }}
                            >
                              Reply
                            </p>
                          )}
                        </IndividualCommentDiv>
                        {comment.reply && (
                          <IndividualCommentDiv style={{ marginLeft: "25px" }}>
                            <p
                              style={{ fontWeight: "500", marginBottom: "3px" }}
                            >
                              <MdSubdirectoryArrowRight
                                style={{ color: "blue" }}
                              />
                              "Listing user" replied:
                            </p>
                            <p style={{ paddingLeft: "15px" }}>
                              {comment.reply}
                            </p>
                          </IndividualCommentDiv>
                        )}
                      </div>
                    );
                  })}
                </CommentFeedDiv>
              )}

            {selectedElement._id !== currentUser._id && (
              <CommentForm
                onSubmit={(e) => {
                  handleCommentSubmit(e, e.target.value, "comment");
                }}
              >
                <textarea
                  maxLength="100"
                  rows="3"
                  cols="40"
                  onChange={(e) => {
                    setCommentFormObject({
                      ...commentFormObject,
                      comment: e.target.value,
                    });
                  }}
                ></textarea>
                <button type="submit">Post</button>
              </CommentForm>
            )}
            {selectedElement._id === currentUser._id && showReplyState && (
              <CommentForm
                onSubmit={(e) => {
                  handleCommentSubmit(e, e.target.value, "reply");
                }}
              >
                <textarea
                  maxLength="100"
                  rows="3"
                  cols="40"
                  placeholder={"@" + " " + commentorUsername}
                  onChange={(e) => {
                    setCommentFormObject({
                      ...commentFormObject,
                      reply: e.target.value,
                    });
                  }}
                ></textarea>
                <ProfileStyledButton type="submit">Reply</ProfileStyledButton>
              </CommentForm>
            )}
            {/* </CommentFeedDiv> */}
          </>
        )}
      </CommentInfoContainer>
    </CommentModalContainer>
  );
};

export const CommentForm = styled.form`
  @media (max-width: 767.9px) {
    flex-direction: column;
  }
  display: flex;
  justify-content: space-between;
  width: 75%;
  margin: 0px auto 40px auto;
  padding-top: 10px;
  height: 15%;
  align-items: center;
  & button {
    @media (max-width: 767.9px) {
      width: 40%;
    }
    height: 40%;
    font-size: 20px;
    background: transparent;
    width: 20%;
    justify-content: center;
  }
  & textarea {
    max-width: 85%;
  }
`;
const IndividualCommentDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px 0px 5px 10px;
  border-left: 1px solid black;
  margin-bottom: 5px;
`;

const CommentFeedDiv = styled.div`
  display: flex;
  margin: 8% auto;
  flex-direction: column;
  /* justify-content: space-between; */
  width: 75%;
  height: 85%;
  padding-right: 15px;
  overflow-y: auto;
`;

const CommentInfoContainer = styled.div`
  @media (min-width: 768px) {
    width: 70%;
  }
  @media (min-width: 1100px) {
    width: 50%;
  }
  @media (max-width: 767.9px) {
    width: 80%;
    & p {
      font-size: 15px;
    }
  }
  /* overflow-y: scroll; */
  position: relative;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: black;
  background-color: white;
  height: 90%;
  z-index: 6;
  & p {
    line-height: 1.3;
  }
`;
const CommentModalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  inset: 0;
  z-index: 5;
  background-color: rgba(0, 0, 0, 0.7);
`;

export default ListingUserCommentsModal;