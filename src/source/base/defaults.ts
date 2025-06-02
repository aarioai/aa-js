import {devicePixelRatio} from '../../browser/detect_device'
import {t_gt_zero} from '../../aa/atype/a_define'
import {t_resolution} from './define'
import {Dict} from '../../aa/atype/a_define_interfaces'

export type SmallCondition = (size: t_gt_zero, original: t_resolution, want: t_resolution, isCrop: boolean) => boolean

export type ImagePatternReplacement = (resolution: t_resolution, isAlter: boolean, isCrop: boolean) => Dict

class DefaultSettings {
    imageDPR = devicePixelRatio()
    smallImageCondition: SmallCondition = null
    imagePatternReplacement: ImagePatternReplacement = null
}

const defaults = new DefaultSettings()
export default defaults