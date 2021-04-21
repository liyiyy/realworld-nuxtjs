import {request} from '@/plugins/request'

export const getTags = data=>{
    return request({
        method:'GET',
        url:'/api/tags',
      })
}
