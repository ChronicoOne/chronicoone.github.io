# ! code dissecting functions

# !! separate_lines : String -> ListOfStrings
# !! takes a string of code from any language and splits it into
# !! a list of <p> lines 
def separate_lines(code):
    return ['<p>' + line + '</p>' for line in code.split("\n") if line != '']
    
# !! chop_lines : ListOfString ListOfStrings ListOfString -> ListOfStrings
# !! takes a list of lines containing code of any language,
# !! a list of keywords and a list of single-line comment indicators for the language
# !! returns a list of strings chopped apart at comments and keywords
def chop_lines(lines, keywords, comments):
    chopped_lines = []
    for line in lines:
        stripped = line.replace("<p>", "").rstrip(" \t")
        single_char = stripped[0]
        double_char = stripped[0] + stripped[1]
        indices = []
        if not (single_char in comments or double_char in comments):
            for word in keywords:
                index = 0
                while line.find(word, index) != -1:
                    indices.append((line.find(word, index), line.find(word, index) + len(word)))
                    index = line.find(word, index) + len(word)
        last_index = 0
        indices.sort()
        for (word_start, word_end) in indices:
            pre_char = ""
            post_char = ""
            chopped_lines.append(line[last_index : word_start])
            last_index = word_end
            if word_start > 0:
                pre_char = line[word_start - 1]
            if word_end < len(line):
                post_char = line[word_end]
            if (not pre_char.isalnum()) and (not post_char.isalnum() and post_char != "="):
                chopped_lines.append(line[word_start : word_end])
            else:
                last_index = word_start
        if last_index < len(line):
            chopped_lines.append(line[last_index:len(line)])
    return chopped_lines
    
# ! code formatting functions
# ! take a string containing python code and format it using classes from code_snips.css
# ! returns an HTML string containing formatted text
# ! String -> HTMLString

# !! Python String Formatting

# !!! Python keywords

python_comments = ["#"]
python_keyword_values = ['False', 'None', 'True']
python_keyword_ops = ['and', 'as', 'assert', 'async', 'await', 
                      'break', 'class', 'continue', 'def', 'del', 
                      'elif', 'else', 'except','finally', 'for', 
                      'from', 'global', 'if', 'import', 'in', 'is', 
                      'lambda', 'nonlocal', 'not', 'or', 'pass', 
                      'raise', 'return', 'try', 'while', 'with',
                      'yield']
                      
python_keywords = python_keyword_values + python_keyword_ops

# !!! format_python : String -> HTMLString
# !!! parses string containing returns an HTML string formatted using stylesheet
def format_python(code_string):
    fragments = chop_lines(separate_lines(code_string), python_keywords, python_comments)
    for i in range(len(fragments)):
        fragment_stripped = fragments[i].replace("<p>", "").replace("</p>", "")
        if fragments[i] in python_keyword_values:
            fragments[i] = "<span class=\"python-value\">" + fragments[i] + "</span>" 
        elif fragments[i] in python_keyword_ops:
            fragments[i] = "<span class=\"python-op\">" + fragments[i] + "</span>"
        elif len(fragment_stripped) > 0:
            if fragment_stripped[0] == "#":
                fragments[i] = "<p><span class=\"python-comment\">" + fragment_stripped + "</span></p>"
    html_block = ''.join(fragments)
    html_block = html_block.replace("    ", "<span class=\"python-indent\">    </span>")
    return html_block