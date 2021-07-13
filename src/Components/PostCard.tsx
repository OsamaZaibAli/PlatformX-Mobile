import React, {FC, useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import {Width, Height, Sizes} from '../Constants/Size';
import {darkColors} from '../Constants/Colors';
import {PROFILE_IMAGE, POST_IMAGE} from '../Constants/sample';
import CommentModal from '../Modals/CommentModal';
import DeleteModal from '../Modals/DeleteModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
// @ts-ignore
import {BASE_URL} from 'react-native-dotenv';
import PopUpMenu from '../Menu/PostCardPopUpMenu';
import Axios from '../Utils/Axios';

const MAX_TEXT_LENGTH = 290;

const ICON_SIZE = Width * 0.07;

type Props = {
  setModal: any;
};
const PostCardButtons: FC<Props> = ({setModal}) => {
  return (
    <View style={styles.postButtonContainer}>
      <TouchableOpacity
        onPress={() => console.log('Pressed on like button')}
        style={styles.PostButton}>
        <Text style={styles.PostButtonText}>Like</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setModal({
            focusTextInput: true,
            showModal: true,
          });
          console.log('Clicked on comment');
        }}
        style={styles.PostButton}>
        <Text style={styles.PostButtonText}>Comment</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => console.log('Pressed on share button')}
        style={styles.PostButton}>
        <Text style={styles.PostButtonText}>Share</Text>
      </TouchableOpacity>
    </View>
  );
};

type props = {
  navigation: any;
  postDetail: any;
};

const PostCard: FC<props> = ({navigation, postDetail}) => {
  const [Commentmodal, setCommentmodal] = useState({
    showModal: false, // show modal or not
    focusTextInput: false, // if true, set auto focus on comment modal text input field to true
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ProfileImageLoading, setProfileImageLoading] = useState(true); // user image
  const [PostImageLoading, setPostImageLoading] = useState(true);
  const [ImageAspectRatio, setImageAspectRatio] = useState(0);

  const handleDelete = () => {
    // hide the modal first
    setShowDeleteModal(false);
    // make an api call
    var bodyFormData = new FormData();

    bodyFormData.append('post', postDetail.id);
    Axios({
      method: 'post',
      url: `${BASE_URL}/api/post/delete/`,
      data: bodyFormData,
      headers: {'Content-Type': 'multipart/form-data'},
    })
      .then(response => {
        if (response.status == 200) {
          ToastAndroid.show(response.data.success, 1500);
        } else {
          ToastAndroid.show(response.data.error, 1500);
        }
      })
      .catch(error => ToastAndroid.show(error, 1500));
  };
  return (
    <View style={styles.parent}>
      {/* comment modal  */}
      <CommentModal
        isShow={Commentmodal.showModal}
        toggleModal={() =>
          setCommentmodal(prev => ({
            ...prev,
            showModal: !prev.showModal,
          }))
        }
        focusTextInput={Commentmodal.focusTextInput}
        postID={postDetail.id}
      />

      {/* delete modal  */}

      <DeleteModal
        heading="Delete Post"
        description={'Would you like to delete your post?'}
        isShow={showDeleteModal}
        toggleModal={() => setShowDeleteModal(prev => !prev)}
        onDelete={handleDelete}
      />

      {/* header  */}
      <View style={styles.headerContainer}>
        <View style={styles.headerImageContainer}>
          <Image
            source={{
              uri: ProfileImageLoading
                ? PROFILE_IMAGE
                : postDetail?.user?.user_profile_image
                ? postDetail?.user?.user_profile_image?.path
                : PROFILE_IMAGE,
            }}
            style={styles.userImage}
            onLoadEnd={() => setProfileImageLoading(false)}
            // onProgress={() => setPostImageLoading(true)}
          />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.username}>{postDetail?.user?.username}</Text>
          <Text style={styles.date}>
            {new Date(postDetail.created_at).toDateString()}
          </Text>
        </View>
        {/* icon container  */}
        <View style={styles.headerIconContainer}>
          <PopUpMenu
            isEditable={postDetail.is_editable}
            deleteModal={postDetail.is_editable && setShowDeleteModal}
            post={postDetail.is_editable ? postDetail : undefined}
            navigation={navigation}
          />
        </View>
      </View>
      {/* content  */}
      <View style={styles.contentContainer}>
        <Text style={styles.descriptionText}>
          {postDetail.text.length > MAX_TEXT_LENGTH
            ? postDetail.text.substring(0, MAX_TEXT_LENGTH - 4) +
              '.... read more'
            : postDetail.text}
        </Text>
      </View>
      {/* image if any  */}
      {postDetail.images.length > 0 && (
        <ScrollView
          horizontal
          pagingEnabled
          endFillColor="#000"
          contentContainerStyle={{
            // width: Width * 0.9,
            marginHorizontal: Width * 0.01,
            // backgroundColor: 'transparent',
            // alignContent: 'space-around',
            // alignItems: 'center',
            // width: Width * 0.9,
            height: Width * ImageAspectRatio * 0.9,
            // flexGrow: 1,
          }}
          showsHorizontalScrollIndicator
          decelerationRate="fast">
          {postDetail.images.map(image => (
            <View style={styles.postImageContainer} key={image.id}>
              <Image
                source={{
                  uri: PostImageLoading ? POST_IMAGE : image.path,
                }}
                style={[
                  {
                    width: Width * 0.9,
                    height: Width * ImageAspectRatio * 0.9,
                  },
                ]}
                resizeMode={'contain'}
                onLoadEnd={() => {
                  // get image width and height
                  Image.getSize(image.path, (width, heigth) => {
                    // calculate aspect ratio of image
                    setImageAspectRatio(heigth / width);
                    setPostImageLoading(false);
                  });
                }}
                // onProgress={() => setPostImageLoading(true)}
              />
            </View>
          ))}
        </ScrollView>
      )}
      {/* like comment share details */}
      <TouchableOpacity
        style={styles.numberContainer}
        onPress={() =>
          setCommentmodal({
            focusTextInput: false,
            showModal: true,
          })
        }>
        <View style={styles.likeContainer}>
          <Text style={styles.PostButtonText}>
            {postDetail.likes.length} Likes
          </Text>
        </View>

        <View style={styles.commentConatiner}>
          <Text style={styles.PostButtonText}>
            {postDetail.comments.length} Comment
          </Text>
        </View>

        <View style={styles.sharContainer}>
          {/* <Text style={styles.PostButtonText}>{postDetail.shares} Share</Text> */}
        </View>
      </TouchableOpacity>
      {/* post buttons   */}
      <PostCardButtons setModal={setCommentmodal} />
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    marginHorizontal: Width * 0.04,
    marginVertical: Width * 0.01,
    // minHeight: Height * 0.35,
    // maxHeight: Height * 0.4,
    borderRadius: 20,
    // padding: 5,
    shadowColor: darkColors.SHADOW_COLOR,
    backgroundColor: darkColors.LIGHT_BACKGROUND,
    shadowOpacity: 1,
    shadowRadius: 25,
    shadowOffset: {width: 10, height: 12},
    elevation: 30,
  },
  headerContainer: {
    minHeight: Height * 0.08,
    maxHeight: Height * 0.15,
    borderBottomColor: darkColors.SHADOW_COLOR,
    borderBottomWidth: 2,
    flexDirection: 'row',
    padding: 7,
  },
  headerImageContainer: {
    // width: Width * 0.3,
    flex: 0.2,
  },
  userImage: {
    height: Height * 0.07,
    width: Width * 0.14,
    borderRadius: 40,
  },
  headerTextContainer: {
    // width: Width * 0.6,
    flex: 0.7,
    flexDirection: 'column',
  },
  username: {
    color: darkColors.TEXT_COLOR,
    fontSize: Sizes.large * 0.9,
    fontWeight: 'bold',
  },
  date: {
    color: darkColors.TEXT_COLOR,
    fontSize: Sizes.normal * 0.75,
  },
  headerIconContainer: {
    flex: 0.1,
    justifyContent: 'center',
  },
  contentContainer: {
    // minHeight: Height * 0.15,
    maxHeight: Height * 0.2,
    marginVertical: 7,
    // padding: 7,
    paddingHorizontal: 7,
  },
  descriptionText: {
    color: darkColors.TEXT_COLOR,
    fontSize: Sizes.normal,
  },
  postImageContainer: {
    // width: Width * 0.961,
    // minHeight: Height * 0.25,
    // maxHeight: Height * 0.3,
    // height: 'auto',
    marginRight: 4,
    // flex: 1,
    // height: Width * (9 / 16),
    // justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  postImage: {
    // width: Width * 0.7,
    // minHeight: Height * 0.2,
    // maxHeight: Height * 0.4,
    // width: Width * 0.95,
    // flex: 1,
    // aspectRatio: 1,
    width: Width * 0.9,
    minHeight: Height * 0.4,
    maxHeight: Height * 0.6,
    // flex: 1,
    // minHeight: Width,
    // width: '100%',
    // height: 'auto',
    // height: Height * 0.3,
    // aspectRatio: 1,
    // maxHeight: Width,
  },
  numberContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    // borderTopWidth: 2,
    padding: 5,
    paddingVertical: 10,
    borderColor: darkColors.SHADOW_COLOR,
    // marginTop: 10,
  },
  likeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentConatiner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sharContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postButtonContainer: {
    // height: Height * 0.06,
    flexDirection: 'row',
    marginVertical: Height * 0.009,
    padding: 5,
  },
  PostButton: {
    flex: 1,
    padding: 9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: darkColors.SHADOW_COLOR,
    marginHorizontal: Width * 0.008,
    borderRadius: 10,
  },
  PostButtonText: {
    fontSize: Sizes.small,
    color: darkColors.TEXT_COLOR,
  },
});

export default PostCard;
