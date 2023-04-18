# ! code dissecting functions

# !! separate_lines : String -> ListOfStrings
# !! takes a string of code from any language and splits it into
# !! a list of <p> lines 
def separate_lines(code):
    return ['<p>' + line + '</p>' for line in code.split("\n") if line != '']
    
# !! isolated : String String -> Boolean
# !! takes the character before and the character after a string
# !! returns whether the string in-between is isolated from the chain
def isolated(pre_char, post_char):
    bool_val = True
    bool_val &= not pre_char.isalnum()
    bool_val &= not post_char.isalnum()
    bool_val &= not pre_char == "="
    bool_val &= not post_char == "="
    bool_val &= not pre_char == "_"
    bool_val &= not post_char == "_"
    return bool_val

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
        for i in range(len(indices)):
            (word_start, word_end) = indices[i]
            pre_char = ""
            post_char = ""
            chopped_lines.append(line[last_index : word_start])
            last_index = word_end
            if word_start > 0:
                pre_char = line[word_start - 1]
            if word_end < len(line):
                post_char = line[word_end]
            if isolated(pre_char, post_char):
                chopped_lines.append(line[word_start : word_end])
            elif i > 0:
                if word_start < indices[i-1][1]:
                    last_index = max(indices[i-1][1], word_end)
                else:
                    last_index = word_start
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
python_keyword_ops = ['and', 'as', 'assert', 'async', 'await', 
                      'break', 'class', 'continue', 'def', 'del', 
                      'elif', 'else', 'except','finally', 'for', 
                      'from', 'global', 'if', 'import', 'in', 'is', 
                      'lambda', 'nonlocal', 'not', 'or', 'pass', 
                      'raise', 'return', 'try', 'while', 'with',
                      'yield']
python_keyword_builtins = ['ArithmeticError', 'AssertionError', 'AttributeError', 
                    'BaseException', 'BlockingIOError', 'BrokenPipeError', 
                    'BufferError', 'BytesWarning', 'ChildProcessError', 
                    'ConnectionAbortedError', 'ConnectionError', 'ConnectionRefusedError', 
                    'ConnectionResetError', 'DeprecationWarning', 'EOFError', 'Ellipsis', 
                    'EnvironmentError', 'Exception', 'False', 'FileExistsError', 
                    'FileNotFoundError', 'FloatingPointError', 'FutureWarning', 
                    'GeneratorExit', 'IOError', 'ImportError', 'ImportWarning', 
                    'IndentationError', 'IndexError', 'InterruptedError', 'IsADirectoryError', 
                    'KeyError', 'KeyboardInterrupt', 'LookupError', 'MemoryError', 
                    'ModuleNotFoundError', 'NameError', 'None', 'NotADirectoryError', 
                    'NotImplemented', 'NotImplementedError', 'OSError', 'OverflowError', 
                    'PendingDeprecationWarning', 'PermissionError', 'ProcessLookupError',
                    'RecursionError', 'ReferenceError', 'ResourceWarning', 'RuntimeError', 
                    'RuntimeWarning', 'StopAsyncIteration', 'StopIteration', 'SyntaxError', 
                    'SyntaxWarning', 'SystemError', 'SystemExit', 'TabError', 'TimeoutError', 
                    'True', 'TypeError', 'UnboundLocalError', 'UnicodeDecodeError', 'UnicodeEncodeError' 
                    'UnicodeError', 'UnicodeTranslateError', 'UnicodeWarning', 'UserWarning', 'ValueError',
                    'Warning', 'WindowsError', 'ZeroDivisionError', 'abs', 'all', 'any', 'ascii', 'bin',
                    'bool', 'breakpoint', 'bytearray', 'bytes', 'callable', 'chr', 'classmethod', 'compile',
                    'complex', 'copyright', 'credits', 'delattr', 'dict', 'dir', 'divmod', 'enumerate', 
                    'eval', 'exec', 'exit', 'filter', 'float', 'format', 'frozenset', 'getattr', 'globals',
                    'hasattr', 'hash', 'help', 'hex', 'id', 'input', 'int', 'isinstance', 'issubclass', 
                    'iter', 'len', 'license', 'list', 'locals', 'map', 'max', 'memoryview', 'min next', 
                    'object', 'oct', 'open', 'ord', 'pow', 'print', 'property', 'quit', 'range',
                    'repr', 'reversed', 'round', 'set', 'setattr', 'slice', 'sorted', 'staticmethod', 'str',
                    'sum', 'super', 'tuple', 'type', 'vars', 'zip']
                      
python_keywords = python_keyword_builtins + python_keyword_ops
python_keywords.sort(key = lambda s: len(s), reverse=True)

# !!! format_python : String -> HTMLString
# !!! parses string containing returns an HTML string formatted using stylesheet
def format_python(code_string):
    fragments = chop_lines(separate_lines(code_string), python_keywords, python_comments)
    for i in range(len(fragments)):
        fragment_stripped = fragments[i].replace("<p>", "").replace("</p>", "")
        if fragments[i] in python_keyword_builtins:
            fragments[i] = "<span class=\"python-builtin\">" + fragments[i] + "</span>" 
        elif fragments[i] in python_keyword_ops:
            fragments[i] = "<span class=\"python-op\">" + fragments[i] + "</span>"
        elif len(fragment_stripped) > 0:
            if fragment_stripped[0] == "#":
                fragments[i] = "<p><span class=\"python-comment\">" + fragment_stripped + "</span></p>"
    for i in range(len(fragments)):
        if fragments[i] == " " or fragments[i] == "  " or fragments[i] == "   ":
            fragments[i] = "<span>" + fragments[i] + "</span>"
            
    html_block = ''.join(fragments)
    html_block = html_block.replace("    ", "<span class=\"python-indent\">    </span>")
    return html_block