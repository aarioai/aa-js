import {devicePixelRatio} from '../../browser/detect_device'
import {t_gt_zero} from '../../aa/atype/a_define'
import {t_size_value} from './define'
import {Dict} from '../../aa/atype/a_define_interfaces'

export type SmallCondition = (size: t_gt_zero, original: t_size_value, want: t_size_value, isCrop: boolean) => boolean

export type ImagePatternReplacement = (resolution: t_size_value, isAlter: boolean, isCrop: boolean) => Dict

class DefaultSettings {
    imageDPR = devicePixelRatio()
    smallImageCondition: SmallCondition = null
    imagePatternReplacement: ImagePatternReplacement = null
}

const defaults = new DefaultSettings()
export default defaults