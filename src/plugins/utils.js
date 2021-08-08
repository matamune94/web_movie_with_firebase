import _kebabCase from 'lodash/kebabCase'
import mongoose from 'mongoose'
export default {
  methods: {
    $_slugify(text) {
      // console.log(text)
      return _kebabCase(
        text
          .toString()
          .toLowerCase()
          .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
          .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
          .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
          .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
          .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
          .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
          .replace(/đ/g, 'd')
          .replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
          .replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
          .replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
          .replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
          .replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
          .replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
          .replace(/Đ/g, 'D')
      )
    },
    $_imgUploader() {
      return 'https://api-zero-phim.herokuapp.com/api/upload'
    },
    $_ObjectId() {
      return mongoose.Types.ObjectId().toString()
    },
    async $_lastNumDoc(collection) {
      let lastNumDoc = -1
      try {
        const snap = await collection.orderBy('numDoc', 'desc').limit(1).get()
        if (snap.docs.map(doc => doc.data()).length) {
          lastNumDoc = snap.docs.map(doc => doc.data())[0].numDoc
        }
      } catch (err) {
        console.log(err)
        throw err
      }
      return lastNumDoc
    },
    $_cutString(v) {
      const arr = v.split('-')
      const list = []
      for (let i = 0; i < arr.length; i++) {
        list.push(arr.filter((o, idx) => idx >= i).join(' '))
      }
      return list
    },
    $_matchString(v, cutMark = '', queue = true) {
      const arr = v.split(cutMark)
      const list = []
      for (let i = 0; i < arr.length; i++) {
        let t = ''
        for (let x = 0; x <= i; x++) {
          t = queue ? t + arr[x] : arr[x]
        }
        list.push(t)
      }
      return list
    }
  }
}
