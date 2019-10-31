<template>
  <div class="message">
    尊敬的{{examiner}}，您好:
    <br/>
    &nbsp;&nbsp;
    您的这次考试已经完美结束！！！
  </div>
</template>

<script>
  export default {
    name: "UserInfo",
    data() {
      return {
        examiner: ""
      };
    },
    mounted: function () {
      var examiner = this.$route.query.data;
      this.examiner = examiner;
    },
    methods: {}
  };
</script>

<style>
  .message {
    position: absolute;
    left: 10%;
    top: 40%;
    width: 80%;
    font: 2em sans-serif;
    color: blue;
  }
</style>
