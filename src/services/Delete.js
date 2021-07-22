import axios from 'axios';
import {OnlineRoot,RootPath} from './Config';

const Delete = (path, root) => {
      const promise = new Promise ((resolve, reject) => {
            axios.delete(`${root ? OnlineRoot : RootPath}${path}`)
            .then((result) => {
                  resolve(result);
            }, (err) => {
                  reject(err)
            })
      })

      return promise;
}

export default Delete;