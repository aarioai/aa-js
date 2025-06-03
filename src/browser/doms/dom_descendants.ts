import {BREAK, t_loopsignal} from '../../aa/atype/a_define_signals'
import {a_node} from './doms'
import {NodeSelector} from './define'

/**
 * List all descendants by generation
 *
 * @example
 *  // <body><div id="main"><h1></h1><h2></h2></div><div class="footer"><img/></div></body>
 *  domGenerations(document.querySelector('body'))
 *  Returns:
 *    [
 *      [div#main, div.footer],         // first generation
 *      [h1, h2, img],                  // second generation
 *      [text, text],                   // third generation
 *    ]
 */
export function descendantNodes(root: Node): Array<Node[]> | null {
    if (!root) {
        return null
    }

    function traverse(node: Node, level: number) {
        if (level > -1) {
            if (!generations[level]) {
                generations[level] = []
            }
            generations[level].push(node)
        }
        Array.from(node.childNodes).forEach(child => {
            traverse(child, level + 1)
        })
    }

    const generations: Array<Node[]> = []
    traverse(root, -1)
    return generations.length > 0 ? generations : null

}

export function forEachDescendantNodes(root: Node, callback: (node: Node) => t_loopsignal) {
    const descendants = descendantNodes(root)
    if (!descendants) {
        return
    }
    for (const peers of descendants) {
        for (const node of peers) {
            if (callback(node) === BREAK) {
                return
            }
        }
    }
}

/**
 * Safely moves all child nodes from one element to another
 */
export function transferChildNodes(sourceNode: NodeSelector | string, targetNode: NodeSelector): Node {
    const source = a_node(sourceNode)
    const target = a_node(targetNode)
    if (!target || target === source) {
        return source
    }

    const children = Array.from(source.childNodes || [])
    const fragment = document.createDocumentFragment()
    children.forEach(node => fragment.appendChild(node))
    target.appendChild(fragment)
    return target
}