<template>
 <div ref="editorElem" style="text-align: left;position: relative;z-index: 1;" id="editorElem" ></div>
</template>
<script>
	import Editor from 'wangeditor'
  import Path from "@/api/path"
  export default {
    name: 'Editor',
     props: ['content'],
    data () {
      return {
        editorContentPath:[],
      }
    },
    methods: {
    // getContent: function () {
    //     alert(this.editorContent)
    // }
    },
    watch:{
      content:function(val){
        if(val !== this.editor.txt.html()){
          this.editor.txt.html(this.content)
          // console.log(this.editor.txt.html())
        }
      }
    },
    mounted() {
      // console.log(this.content)
      this.editor = new Editor(this.$refs.editorElem)
      //上传图片到服务器
      this.editor.customConfig.uploadImgServer = Path + "admin/common/fileUploads";
      //服务器返回数据
      this.editor.customConfig.uploadImgHooks = {
            customInsert: function (insertImg, result, editor) {
                // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
                // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果          
                // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
                var url =result.data;
                url.map(function(v,i){
                  insertImg(Path+v);
                })
                // result 必须是一个 JSON 格式字符串！！！否则报错
            }
      };
        //获取富文本内容
      this.editor.customConfig.onchange = (html) => {
          let img = document.getElementById('editorElem').getElementsByTagName('img');
          this.editorContentPath = [];
          if(img.length){
            for (let i=0; i < img.length;i++) {
              this.editorContentPath.push(img[i].src)
            }
          }
          this.$store.state.app.editorContent = html
          this.$store.state.app.editorContentPath = this.editorContentPath
      }
      this.editor.create()
      this.editor.txt.html(this.content)
    }
  }
</script>