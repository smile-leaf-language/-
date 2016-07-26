//第一：传统的函数式编程缺点：添加很多全局变量，不利于别人重复使用，new这个函数也并不能继承这个对象上的方法，别人使用以前提供的方法，你就不能轻易的去修改，不利于团队代码的维护
//面向对象编程会将你的需求抽象成一个对象，然后针对这个对象分析其特征（属性）与动作（方法）。可以把你需要的功能放到一个对象里。
//javascript是一门灵活的语言，不同的人会写出不同风格的代码，在团队开发中慎重挥霍，尽量保证团队开发代码风格的一致性，这也是团队代码易开发、可维护以及代码规范的必然要求！
//用对象收编变量   创建检测对象   然后把我们的方法放在里面  这样可减少覆盖或被覆盖的风险，如果一旦被覆盖，所有的功能都会失效，这种现象很明显，也很轻易察觉到
var CheckObject = {
    checkName: function() {
        //验证姓名
    },
    checkEmail: function() {
        //验证邮箱
    }
}

//对象的另一种形式  这种形式缺点：别人不能复制  在用new关键字创建新的对象时，新创建的对象不能继承这些方法(因为这些方法是类私有的属性，不是每个对象自己身上都会有的私有的，也不是共有的)
var CheckObject = function() {};
CheckObject.checkName = function() {
    //验证姓名
};
CheckObject.checkEmail = function() {
    //验证邮箱
};
var a = new CheckObject(); //new 关键字都做了什么？很简单，就干了三件事情。var obj  = {}; obj.__proto__ = CheckObject.prototype; CheckObject.call(obj);
/*new 关键字都做了什么？
第一行，我们创建了一个空对象obj
第二行，我们将这个空对象的__proto__成员指向了CheckObject函数对象prototype成员对象
第三行，我们将Base函数对象的this指针替换成obj，然后再调用CheckObject函数，于是我们就给obj对象赋值了一个id成员
总结：构造子中，我们来设置‘类’的成员变量（例如：例子中的id），构造子对象prototype中我们来设置‘类’的公共方法。于是通过函数对象和Javascript特有的__proto__与prototype成员及new操作符，模拟出类和类实例化的效果。
*/
console.log(a.checkEmail); //undefined

//真假对象  每次调用都返回来一个新对象，这样执行过程中明面上是CheckObject对象，实际上是返回的新对象，这样每个人在使用的时候就互不影响了
var CheckObject = {
    return {
        checkName: function() {
            //验证姓名
        },
        checkEmail: function() {
            //验证邮箱
        }
    }
}

//调用
var a = CheckObject();
a.checkName();

//但是上面这个不是一个真正意义上的类的创建方式，并且a和CheckObject没有任何关系（返回出来的对象本身就与CheckObject对象无关）,所以稍加改造
var CheckObject = {
    this.checkName: function() {
        //验证姓名
    },
    this.checkEmail: function() {
        //验证邮箱
    }
}
//调用
var a =new CheckObject();
a.checkName();
/*
上面这种缺点就是：所有方法放在函数内部了，通过this定义的，所以每次通过new关键字创建新对象的时候，新对象都会对类的this上的属性进行复制，
新创建的对象都会有自己的一套方法，然而有时候这么做造成的消耗是很奢侈的，浪费内存，（比如有一千个对象，就会这一千个对象创造一千个checkName这个方法）
*/
//------------------------------------------------------------------------------------------------------------------------
//新创建出来的对象所拥有的方法就是公用的一个了，因为他们都是依赖prototype原型一次寻找，而找到的方法都是同一个（都绑定在CheckObject对象类的原型上）
var CheckObject = function() {};
CheckObject.prototype.checkName = function() {
    //验证姓名
};
CheckObject.prototype.checkEmail = function() {
    //验证邮箱
};
//但是上面这种方式要将prototype写很多遍所以可以这样
var CheckObject = function() {};
CheckObject.prototype = {
    checkName = function() {
        //验证姓名
    };
    checkEmail = function() {
        //验证邮箱
    };
};
//调用
var a =new CheckObject();
a.checkName();
a.checkEmail();
//但是这两种方式不能混着用，否则一旦混着用，如果后面为对象的原型对象赋值新对象时，那么他将会覆盖掉之前对prototype对象赋值的方法
//-------------------------------------------------------------------------------------------------------------------------------------
//你调用了2个方法，你对对象a书写了2遍，其实这是可以避免的，例如下面将当前对象返回，this指向的就是当前对象
var CheckObject = function() {};
CheckObject.prototype = {
    checkName = function() {
        //验证姓名
        return this;
    };
    checkEmail = function() {
        //验证邮箱
        return this;
    };
};
//这样可以链式调用
CheckObject.checkName().checkEmail();
//同样的方法放到类的原型对象中
var CheckObject = function() {};
CheckObject.prototype = {
    checkName = function() {
        //验证姓名
        return this;
    };
    checkEmail = function() {
        //验证邮箱
        return this;
    };
};
//调用（使用的时候要先创建一下）
var a =new CheckObject();
a.checkName().checkEmail();
//-----------------------------------------------------------------------------------------------------------------------------------------------
//prototype.js框架是对原生对象的（例如Function、Array等）的拓展
/*
我们尽量不要污染原生对象Function等，不然别人创建的函数也会被你创建的函数所污染（每个人创建的函数通过原型链也会创建一次），造成不必要的开销，
但你可以抽象一个统一添加方法的功能方法
*/
Function.prototype.addMethod = function(name, fn) {
    this[name] = fn;
};
//这样你想添加验证姓名和验证邮箱方法，可以这样
var methods = function() {};
//或者methods = new Function();
methods.addMethod("checkName",function() {
    //验证姓名
});
methods.addMethod("checkEmail",function() {
    //验证邮箱
});
//调用
methods.checkName();
//-------------------------------------------------------------------------------------------------------------
//链式添加方法
Function.prototype.addMethod = function(name, fn) {
    this[name] = fn;
    return this;
};
var methods = function() {};
//或者methods = new Function();
methods.addMethod("checkName",function() {
    //验证姓名
}).addMethod("checkEmail",function() {
    //验证邮箱
});
//链式使用方法
var methods = function() {};
//或者methods = new Function();
methods.addMethod("checkName",function() {
    //验证姓名
    return this;
}).addMethod("checkEmail",function() {
    //验证邮箱
    return this;
});
//调用
methods.checkName().checkEmail();
//---------------------------------------------------------------------------------------------------------------
//换一种方式使用方法类式调用方式
Function.prototype.addMethod = function(name, fn) {
    this.prototype[name] = fn;
    return this;
};
//添加方法
var Methods = function() {};
//或者methods = new Function();
Methods.addMethod("checkName",function() {
    //验证姓名
}).addMethod("checkEmail",function() {
    //验证邮箱
});
//使用的时候注意了，不能直接使用，要通过new关键字创建对象
var m = new Methods();
m..checkName();
