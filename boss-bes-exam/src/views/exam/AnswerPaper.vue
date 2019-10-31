<template>
  <div class="body">
    <el-row :gutter="30">
      <el-col :span="6" style="color:blue;">{{paper.exminer}}</el-col>
      <el-col :span="12" class="rowTitle"><label>{{paper.title}}</label></el-col>

    </el-row>

    <el-row class="timeTimer">
      <label class="el-icon-bell"></label>
      <label>倒计时:</label>
      <label>{{countTime.hour}}:{{countTime.minute}}:{{countTime.second}}</label>
    </el-row>

    <div
      v-for="(item , index) of paper.subjectDetailsVOList"
      class="subjectDiv"
      v-bind:index="index"
      v-bind:key="item.id"
    >
      <label>{{index + 1}}.{{item.subjectType}}&nbsp;{{item.subjectContent}}</label>
      <br/>
      <br/>
      <!--      单选-->
      <div v-if="item.subjectType == '单选题'">
        <el-radio-group v-model="paper.answerRecordListVOList[index].myAnswer">
          <el-radio
            v-for="(itemAnswer , indexAnswer) of item.answers"
            :index="indexAnswer"
            :key="itemAnswer.id"
            :label="itemAnswer.id"
            :value="itemAnswer.id"
            class="radioClass"
          >
            {{answerRadio[indexAnswer]}}.{{itemAnswer.answer}}
            <br/>
            <br/>
          </el-radio>
        </el-radio-group>
      </div>
      <!--      多选-->
      <div v-if="item.subjectType == '多选题'">
        <el-checkbox-group v-model="paper.answerRecordListVOList[index].myAnswer">
          <el-checkbox
            v-for=" (itemAnswer , indexAnswer) in item.answers"
            :key="itemAnswer.id"
            :label="itemAnswer.id"
            :value="itemAnswer.id"
            class="radioClass"
          >
            {{answerRadio[indexAnswer]}}.{{itemAnswer.answer}}
            <br/>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <!--      判断-->
      <div v-if="item.subjectType == '判断题'">
        <el-radio-group v-model="paper.answerRecordListVOList[index].myAnswer">
          <el-radio label="正确">正确</el-radio>
          <el-radio label="错误">错误</el-radio>
        </el-radio-group>
      </div>
      <!--      填空-->
      <div v-if="item.subjectType == '填空题'">
        <el-input
          v-model="paper.answerRecordListVOList[index].myAnswer"
          size="small"
          class="inputAnswer"
        ></el-input>
      </div>
      <!--      编程-->
      <div v-if="item.subjectType == '编程题'">
        <label style="color:red;font-size: 0.5em;">友情提示：手动输入和上传图片只能二者选其一，以最后一次选择的方式为答案</label>
        <br/>
        <br/>
<!--        手动编写-->
        <el-input
          v-if="paper.answerRecordListVOList[index].type === 1 "
          v-model="paper.answerRecordListVOList[index].myAnswer"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          size="small"
          class="inputAnswer"
        ></el-input>
        <el-button v-if="paper.answerRecordListVOList[index].type === 2 " size="small" type="primary" @click="openInput(index)">放弃图片上传</el-button>
<!--        上传图片-->
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-remove="openInput"
          accept="image/png, image/jpg, image/jpeg"
          :limit="1"
          ref="upload"
          auto-upload="false"
          :http-request="imageUpload"
          v-model="paper.answerRecordListVOList[index].myAnswer"
        >
          <img
            v-if="paper.answerRecordListVOList[index].type === 2 "
            :src="paper.answerRecordListVOList[index].myAnswer"
            class="avatar"
          />
          <br/><br/>
          <el-button size="small" type="primary" @click="setMessage(index)">点击上传</el-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </el-upload>
      </div>
      <!--      问答题-->
      <div v-if="item.subjectType == '问答题'">
        <el-input
          v-model="paper.answerRecordListVOList[index].myAnswer"
          type="textarea"
          :rows="4"
          placeholder="请输入内容"
          size="small"
          class="inputAnswer"
        ></el-input>
        <br/>
        <br/>
      </div>
      <br/>
    </div>
    <br/>
    <div class="submitButton">
      <el-button v-if="paper.id != null" type="primary" @click="addAnswer">提交</el-button>
    </div>

    <el-button @click="test">测试</el-button>
  </div>
</template>

<script>
  import Bus from "../../components/bus";
  import {
    submitTestForTimer,
    submitTestPaper,
    backAnswer,
    uploadFile,
    uploadImage
  } from "../../api/exam";

  export default {
    name: "AnswerPaper",
    data() {
      return {
        paper: {},
        submitPaper: {},
        countTime: {
          hour: 0,
          minute: 0,
          second: 0
        },
        timerTime: "",
        fileList: [],
        submitImage: {
          id: "",
          answerId: "",
          examRecordId: "",
          paperSubjectId: ""
        },
        index: -1,
        checkData: [],
        timer: "",
        answerRadio : ["A","B","C","D","E","F","G","H","I","J","K","L","M","N"]
      };
    },
    mounted() {
      console.log(this.paper)
      let that = this;
      let data = this.$route.query.data;
      if (typeof data == "undefined") {
        // that.backAnswerPaper();
      } else {
        that.setPaper();
        that.setTimer();
      }
      console.log(this.paper)
    },
    methods: {
      test(){
        console.log(this.paper)
      },
      /**
       * 打开输入框，放弃图片上传
       */
      openInput(index){
        this.$confirm("是否放弃上传图片？如果数据已被使用则不可删除", "", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确认",
          cancelButtonText: "取消"
        }).then(() => {
          let answerRecordListVOList = this.paper.answerRecordListVOList;
          answerRecordListVOList[index].myAnswer = "";
          answerRecordListVOList[index].type = 1;
        }).catch(() => {

        });

      },
      /**
       * 设置多选题的格式，设置编程题的答题类型
       */
      setPaper(){
        let that = this;
        that.paper = that.$route.query.data;
        let paper = that.paper;
        let answerRecordListVOList = paper.answerRecordListVOList;
        let subjectDetailsVOList = paper.subjectDetailsVOList;

        for (let i = 0; i < answerRecordListVOList.length; i++) {
          answerRecordListVOList[i].type = 1;
          if (subjectDetailsVOList[i].subjectType == "多选题") {
            if (
              answerRecordListVOList[i].myAnswer == null ||
              answerRecordListVOList[i].myAnswer == ""
            ) {
              answerRecordListVOList[i].myAnswer = new Array();
            } else {
              answerRecordListVOList[i].myAnswer = JSON.parse(
                answerRecordListVOList[i].myAnswer
              );
            }
          }
        }
        that.paper.answerRecordListVOList = answerRecordListVOList;
      },
      /**
       * 设置图片提交的数据
       */
      setMessage(index) {
        this.index = index;
        let answerRecordListVOList = this.paper.answerRecordListVOList;
        this.submitImage.id = this.paper.id;
        this.submitImage.answerId = answerRecordListVOList[index].id;
        this.submitImage.examRecordId =
          answerRecordListVOList[index].examRecordId;
        this.submitImage.paperSubjectId =
          answerRecordListVOList[index].paperSubjectId;
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      imageUpload(param) {
        console.log("dddddd")
        console.log(param)
        if (this.index == -1) {
          console.log("cccccc")
          return false;
        } else {
          let that = this;
          //获取文件
          const file = param.file;
          let fileParams = new FormData();
          //设置文件格式
          fileParams.append("image_data", file);
          fileParams.append("data", JSON.stringify(this.submitImage));
          uploadFile(fileParams)
            .then(resp => {
              if (resp.responseHead.code === "0") {
                alert("上传成功！");
                that.paper.answerRecordListVOList[that.index].myAnswer =
                  resp.body;
                console.log(that.paper);
                that.paper.answerRecordListVOList[that.index].type = 2;
                console.log(that.paper);
                that.index = -1;
              } else {
                alert(
                  "错误码：" +
                  resp.responseHead.code +
                  ";错误信息：" +
                  resp.responseHead.message
                );
              }
            })
            .catch(() => {
              this.$message({
                showClose: true,
                message: "系统异常",
                type: "error"
              });
            });
        }
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === "image/jpeg";
        const isGIF = file.type === "image/gif";
        const isPNG = file.type === "image/png";
        const isBMP = file.type === "image/bmp";
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG && !isGIF && !isPNG && !isBMP) {
          this.$message.error("上传图片必须是JPG/GIF/PNG/BMP 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传图片大小不能超过 2MB!");
        }
        return (isJPG || isBMP || isGIF || isPNG) && isLt2M;
      },
      /**
       * 设置定时时间
       */
      setTimer() {
        this.timerTime = this.paper.timerTime;
        let limitTime = this.paper.limitTime;
        //设置倒计时时间
        this.countTime = {
          hour: parseInt(limitTime / 3600),
          minute: parseInt((limitTime % 3600) / 60),
          second: Number(limitTime % 60)
        };
        this.add();
        let timerTime = this.timerTime;
        console.log("定时时间");
        console.log(timerTime);

        let that = this;
        if (typeof timerTime != "undefined" && timerTime != null) {
          this.timer = setInterval(() => {
            this.addAnswerTimer();
          }, Number(this.timerTime));
          console.log("dddd");
          //setInterval(this.addAnswerTimer, Number(this.timerTime));
        } else {
          //setInterval(this.addAnswerTimer, Number(300000));
          this.timer = setInterval(() => {
            this.addAnswerTimer();
          }, Number(300000));
          console.log("cccc");
        }
      },
      /**
       * 考试关机回来后自动返回数据
       */
      backAnswerPaper() {
        let data = {
          examiner: "Cesare",
          tel: "11111111",
          sex: 1,
          examPublishRecordId: "9",
          status: "1"
        };
        let that = this;
        backAnswer(data)
          .then(resp => {
            if (resp.responseHead.code === "0") {
              that.paper = resp.body;
              that.setTimer();
            } else {
              alert(
                "错误码：" +
                resp.responseHead.code +
                ";错误信息：" +
                resp.responseHead.message
              );
            }
          })
          .catch(() => {
            this.$message({
              showClose: true,
              message: "系统异常",
              type: "error"
            });
          });
      },
      /**
       * 设置多选题答案
       */
      setAnswer() {
        let paper = this.paper;
        let answerRecordListVOList = paper.answerRecordListVOList;
        let str = JSON.stringify(answerRecordListVOList);

        let answerRecordItemVOList = JSON.parse(str);
        let subjectDetailsVOList = paper.subjectDetailsVOList;

        for (let i = 0; i < answerRecordListVOList.length; i++) {
          if (subjectDetailsVOList[i].subjectType == "多选题") {
            if (answerRecordListVOList[i].myAnswer != null) {
              answerRecordItemVOList[i].myAnswer = JSON.stringify(
                answerRecordListVOList[i].myAnswer
              );
            }
          }
        }
        paper.answerRecordItemVOList = answerRecordItemVOList;
        return paper;
      },
      /**
       * 提交答案提示
       */
      addAnswer() {
        let _this = this
        if (
          _this.countTime.hour === 0 &&
          _this.countTime.minute === 0 &&
          _this.countTime.second === 0
        ) {
          _this.addAnswer();
        } else {
          this.$confirm("是否提交试卷？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            center: true
          })
            .then(() => {
              this.saveAnswer();
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "提交失败"
              });
            });
        }

      },
      /**
       *提交答案
       */
      saveAnswer() {
        let that = this;
        let data = that.setAnswer();
        // data.answerRecordItemVOList = data.answerRecordListVOList;
        //提交试卷
        data.status = 2;
        submitTestPaper(data)
          .then(resp => {
            if (resp.responseHead.code === "0") {
              debugger;
              this.$message({
                type: "success",
                message: "提交成功!"
              });
              that.$router.push({
                path: `/examEnd`,
                query: {
                  data: that.paper.examiner
                }
              });
              clearInterval(that.timer);
              this.timer = null;
            } else {
              alert(
                "错误码：" +
                resp.responseHead.code +
                ";错误信息：" +
                resp.responseHead.message
              );
            }
          })
          .catch(() => {
            this.$message({
              showClose: true,
              message: "系统异常",
              type: "error"
            });
          });
      },
      /**
       * 定时提交答案
       */
      addAnswerTimer() {
        let that = this;
        let data = that.setAnswer();
        // data.answerRecordItemVOList = data.answerRecordListVOList;
        submitTestForTimer(data)
          .then(resp => {
            if (resp.responseHead.code === "0") {
              console.log(resp);
            } else {
              alert(
                "错误码：" +
                resp.responseHead.code +
                ";错误信息：" +
                resp.responseHead.message
              );
            }
          })
          .catch(() => {
            this.$message({
              showClose: true,
              message: "系统异常",
              type: "error"
            });
          });
      },
      /**
       * 设置倒计时时间
       */
      add: function () {
        let _this = this;
        let time = window.setInterval(function () {
          if (
            _this.countTime.hour === 0 &&
            _this.countTime.minute === 5 &&
            _this.countTime.second === 0
          ) {
            _this.$message('还有五分钟交卷了！');
          }
          if (
            _this.countTime.hour === 0 &&
            _this.countTime.minute === 0 &&
            _this.countTime.second === 0
          ) {
            _this.addAnswer();
          }
          if (
            _this.countTime.second === 0 &&
            _this.countTime.minute === 0 &&
            _this.countTime.hour !== 0
          ) {
            _this.countTime.second = 59;
            _this.countTime.minute = 59;
            _this.countTime.hour -= 1;
          } else if (
            _this.countTime.second === 0 &&
            _this.countTime.minute !== 0
          ) {
            _this.countTime.second = 59;
            _this.countTime.minute -= 1;
          } else if (
            _this.countTime.minute === 0 &&
            _this.countTime.second === 0
          ) {
            _this.countTime.second = 0;
            window.clearInterval(time);
          } else {
            _this.countTime.second -= 1;
          }
        }, 1000);
      },
      /**
       * 关闭界面
       */
      closeWindow() {
        let userAgent = navigator.userAgent;
        if (
          userAgent.indexOf("Firefox") != -1 ||
          userAgent.indexOf("Chrome") != -1
        ) {
          window.location.href = "about:blank";
        } else if (
          userAgent.indexOf("Android") > -1 ||
          userAgent.indexOf("Linux") > -1
        ) {
          window.opener = null;
          window.open("about:blank", "_self", "").close();
        } else {
          window.opener = null;
          window.open("about:blank", "_self");
          window.close();
        }
      }
    }
  };
</script>

<style scoped>
  .body {
    margin: 3% 3%;
    width: 94%;
  }

  .timeTimer {
    color: red;
    text-align: right;
  }

  .rowTitle {
    text-align: center;
  }

  .subjectDiv {
    text-align: left;
  }

  .inputAnswer {
    width: 50%;
  }

  .submitButton {
    text-align: center;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .radioClass {
    position: relative;
    left: 1%;
    width: 90%;
  }
</style>
