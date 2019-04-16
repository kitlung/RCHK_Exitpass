<template>
  <div class="overlay" @click="close()">
    <div class="container" v-bind:class="title == 'SUCCESS' ? 'success' : 'fail'">
      <div class="upper">
        <div class="title">
          <font-awesome-icon class="icon" icon="check-circle" v-if="title == 'SUCCESS'"></font-awesome-icon>
          <font-awesome-icon :icon="['far', 'times-circle']" class="icon" v-if="title != 'SUCCESS'"></font-awesome-icon>
          <div>{{title}}</div>
        </div>
      </div>
      <div class="lower"> 
        <div class="content">
          <div v-if="title == 'FAIL'" >Forbidden.</div> <br v-if="title == 'FAIL'">
          <div v-if="title == 'ERROR'" >Error.</div> <br v-if="title == 'ERROR'">
          <div>{{content}}</div>
          <div v-if="title == 'ERROR'">Please try again.</div>
          <font-awesome-icon :icon="['far', 'times-circle']" class="icon"></font-awesome-icon>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Message',
  props: {
    title: String,
    content: String
  },
  data () {
    return {
    }
  },
  methods: {
    close () {
      this.$emit('close-message')
    }
  }
}
</script>
<style lang="scss" scoped>
$success: #72bb53;
$fail: #f50057;

  .overlay{
    position: fixed; /* Sit on top of the page content */
    top: 0; 
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.3); /* Black background with opacity */
    z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
    cursor: pointer; /* Add a pointer on hover */
    .container{
      position: absolute;
      top: 120px;
      left: 315px;
      height: 500px;
      width: 400px;
      &.success{
        .upper{
          color: $success;
          background-color: #fff;  
        }
        .lower{
          background-color: $success;
          color: #fff;
        }
      }
      &.fail{
        .upper{
          color: $fail;
          background-color: #fff;  
        }
        .lower{
          background-color: $fail;
          color: #fff;
          .content{
            div{
              font-size: 30px;
            }
          }
        }
      }
      .upper{
        height: 65%;
      }
      .lower{
        height: 35%;
      }
      .title{
        padding-top: 60px;
        .icon{
          font-size: 170px;
        }
        div{
          font-size: 80px;
          margin-top: 50px;
        }
      }
      .content{
        padding-top: 20px;
        div{
          font-size: 40px;
        }
        .icon{
          font-size: 50px;
          margin-top: 20px;
        }
      }
    }
  }
</style>
