//FeedForm

//feedForm

import React from "react";
import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { CiMemoPad } from "react-icons/ci";
import { SlPicture } from "react-icons/sl";
import { BsPencilSquare } from "react-icons/bs";

function FeedForm() {
  const [feed, setFeed] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.UserInfo.userInfo);

  const onChange = (event) => {
    const {
      target: { name, value }
    } = event;
    if (name === "content") {
      setContent(value);
    }
    if (name === "title") {
      setTitle(value);
    }
  };

  //글 추가하기
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("빈곳없이 다 작성해주세요!");
      return;
    }

    const uploadFeed = async (img) => {
      setFeed([img, ...feed]);
      const newsFeedRef = collection(db, "newsFeed");
      await addDoc(newsFeedRef, { ...img, date: Timestamp.fromDate(new Date()) });
      setSelectedFile(null);
    };

    if (!selectedFile) {
      const defaultRef = ref(storage, `/defaultImg/background.png`);
      const defaultImgdURL = await getDownloadURL(defaultRef);
      const newFeed = {
        postId: crypto.randomUUID(),
        title,
        content,
        date: new Date().toLocaleString(),
        isEdited: false,
        writer: userInfo.name,
        img: defaultImgdURL,
        likes: {
          likeCount: 0,
          users: []
        }
      };
      alert("이미지가 없을 경우 기본 이미지로 대체됩니다.");
      await uploadFeed(newFeed);
    } else {
      // 파일 업로드
      const imageRef = ref(storage, `${userInfo.email}/${selectedFile.name}`);
      await uploadBytes(imageRef, selectedFile);
      const downloadURL = await getDownloadURL(imageRef);
      const newFeed = {
        postId: crypto.randomUUID(),
        title,
        content,
        date: new Date().toLocaleString(),
        isEdited: false,
        writer: userInfo.name,
        img: downloadURL, // 좋아요 default 값 추가
        likes: {
          likeCount: 0,
          users: []
        }
      };
      await uploadFeed(newFeed);
    }

    alert("작성 완료!");
    setTitle("");
    setContent("");
    e.target.file.value = "";
    navigate("/home");
  };

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files?.[0]);
    alert("사진 첨부가 완료됐습니다!");
  };

  const writingCancle = (e) => {
    alert("작성을 취소하겠습니까?");
    navigate("/home");
  };

  return (
    <>
      <AllWrap>
        <FormWrap>
          <TodayLetter>
            <CiMemoPad />
            어떤 이야기를 나누고 싶나요?
          </TodayLetter>

          <form onSubmit={onSubmit}>
            <TitleWrap>
              <Title>
                <BsPencilSquare />
                제목을 작성해주세요
              </Title>
              <TitleInputBox>
                <TitleInput type="text" onChange={onChange} value={title} name="title" />
              </TitleInputBox>
            </TitleWrap>
            <FileWrap>
              <label for="file">
                <section>
                  <SlPicture />
                  사진 첨부하기
                </section>
              </label>
              <FileInput type="file" name="file" id="file" onChange={handleFileSelect} name="file" />
            </FileWrap>

            <ContentWrap>
              <ContentItem>
                <BsPencilSquare />
                내용을 입력해주세요
              </ContentItem>

              <TextAreaWrap>
                <FeedTextArea type="text" onChange={onChange} value={content} name="content" />

                <FeedFormBtn>
                  <section>
                    <GoToHome onClick={writingCancle}>작성취소</GoToHome>
                  </section>
                  <article>
                    <AddDeleteBtn>작성하기</AddDeleteBtn>
                  </article>
                </FeedFormBtn>
              </TextAreaWrap>
            </ContentWrap>
          </form>
        </FormWrap>
      </AllWrap>
    </>
  );
}

const FileInput = styled.input`
  display: none;
`;

const AllWrap = styled.div`
  background-color: #f7f6f6;
`;

const FormWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 1rem;
`;

const TodayLetter = styled.div`
  border: 3px solid black;
  border-radius: 5px;
  height: 60px;
  width: 800px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 1rem;
  background-color: white;
  &:hover {
    background: #ede9e9;
  }
`;

const TitleWrap = styled.div`
  border-radius: 5px;
  border: 3px solid black;
  height: 90px;
  width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 1rem;
  background-color: white;
`;

const Title = styled.div`
  height: 20px;
`;

const TitleInputBox = styled.div`
  height: 40px;
`;

const TitleInput = styled.input`
  width: 600px;
  border-width: 0 0 1px;

  height: 40px;
  font-size: 20px;
  &:focus {
    outline: none;
  }
`;

const FileWrap = styled.div`
  border: 3px solid black;
  border-radius: 5px;
  height: 50px;
  width: 800px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 1rem;
  background-color: white;
  &:hover {
    background: #ede9e9;
  }
`;

const ContentWrap = styled.div`
  border: 3px solid black;
  height: 400px;
  width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 1rem;
  border-radius: 5px;
  background-color: white;
`;

const ContentItem = styled.div`
  height: 10%;
`;

const TextAreaWrap = styled.div`
  /* border: 1px solid black; */
  height: 80%;
`;
const FeedTextArea = styled.textarea`
  width: 700px;
  height: 280px;
  resize: none;
  border: solid 2px #c2bdbd;
  border-radius: 5px;
`;

const FeedFormBtn = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;
const GoToHome = styled.button`
  background-color: #a8c3f0;
  color: white;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 5px;
  width: 150px;
  cursor: pointer;

  &:hover {
    background-color: #439fe1;
    transition: all 0.3s;
  }
`;

const AddDeleteBtn = styled.button`
  background-color: #fab3d7;
  color: white;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 150px;

  &:hover {
    background-color: #f772b0;
    transition: all 0.3s;
  }
`;
export default FeedForm;
