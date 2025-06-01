import {devicePixelRatio} from '../../browser/detect_device'
import {t_nonzero_uint} from '../../aa/atype/a_define'
import {t_resolution} from './define'
import {MapObject} from '../../aa/atype/a_define_interfaces'

export type SmallCondition = (size: t_nonzero_uint, original: t_resolution, want: t_resolution, isCrop: boolean) => boolean

export type ImagePatternReplacement = (resolution: t_resolution, isAlter: boolean, isCrop: boolean) => MapObject

class DefaultSettings {
    imageDPR = devicePixelRatio()
    smallImageCondition: SmallCondition = null
    imagePatternReplacement: ImagePatternReplacement = null
}

const defaults = new DefaultSettings()
export default defaults