import page_builder as pb
import chronico_script as cs
from lxml import etree
from os import listdir
from os.path import isfile, join, dirname, realpath, split

dir_path = dirname(realpath(__file__))
core_path = join(dir_path, 'core')

def gen_html_file(corefilepath):
    if not '.chronico' in corefilepath:
        return -1
        
    file_start = corefilepath
    file_end = split(file_start)[1]
    file_start = split(file_start)[0]
    
    while split(file_start)[1] != 'core':
        file_end = join(split(file_start)[1], file_end)
        file_start = split(file_start)[0]
        
    file_end = file_end.replace('.chronico', '.html')
    
    htmlfilepath = join(dir_path, file_end)
    
    print("Generating File at:", file_end)
    
    f = open(corefilepath, "r")
    text = f.read()
    lines = cs.split_script(text)
    elements = cs.multi_parse(file_end, lines)
    main_article = etree.Element('article')
    for element in elements:
        main_article.append(element)
        
    html_tree = pb.build_page(file_end, main_article)
    etree.indent(html_tree)
    html_doc = etree.tostring(html_tree, method="html", pretty_print=True)
    out_file = open(htmlfilepath, "wb")
    out_file.write(html_doc)
    out_file.close()

def gen_html_branch(dirpath):
    for branch in listdir(dirpath):
        if isfile(join(dirpath, branch)):
            gen_html_file(join(dirpath, branch))
        else:
            gen_html_branch(join(dirpath, branch))


if __name__ == "__main__":
    gen_html_branch(core_path)